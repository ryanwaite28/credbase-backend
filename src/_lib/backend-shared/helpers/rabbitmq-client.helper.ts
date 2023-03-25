import { ContentTypes, mapify, MapType, wait } from "@lib/fullstack-shared";
import * as amqplib from "amqplib";
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  Subject,
  Subscription,
  take,
} from "rxjs";
import { ServiceMethodResults } from "../interfaces/common.interface";
import { SERIALIZERS } from "../utils/serializers.utils";



export interface QueueConfig { name: string, handleMessageTypes: string[], options?: amqplib.Options.AssertQueue }
export interface ExchangeConfig { name: string, type: string, options?: amqplib.Options.AssertExchange }
export interface QueueExchangeBindingConfig { queue: string, exchange: string, routingKey: string }

export type RmqEventMessage<T = any> = { data: T, message: amqplib.ConsumeMessage };

export type AckFn = (message: amqplib.Message) => void;

export type RabbitMqInitConfig = {
  delayStart?: number,
  connection_url: string,
  retryAttempts: number,
  retryDelay: number
  prefetch?: number,
  queues: Array<QueueConfig>,
  exchanges: Array<ExchangeConfig>,
  bindings: Array<QueueExchangeBindingConfig>,

  pre_init_promises?: (Promise<any> | (() => Promise<any>))[],
  post_init_promises?: (Promise<any> | (() => Promise<any>))[],
};


export class RabbitMQClient {
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;
  private isReady: boolean = false;
  private isReadyStream: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isReady);
  private connectionErrorStream: Subject<any> = new Subject<any>();
  private connectionCloseStream: Subject<any> = new Subject<any>();

  private queues: MapType<amqplib.Replies.AssertQueue> = {};
  private exchanges:MapType<amqplib.Replies.AssertExchange> = {};
  private bindings: QueueExchangeBindingConfig[] = [];

  private DEFAULT_LISTENER_TYPE = '__default';

  private queueListeners: MapType<Subscription> = {};
  private queueToEventHandleMapping: MapType<
    MapType<Subject<RmqEventMessage>>
  > = {};


  get onReady(): Observable<boolean> {
    return this.isReadyStream.asObservable().pipe(
      filter((state) => !!state),
      take(1)
    );
  }
  
  get onConnectionError(): Observable<any> {
    return this.connectionErrorStream.asObservable();
  }

  get onConnectionClose(): Observable<any> {
    return this.connectionCloseStream.asObservable();
  }

  constructor(options: RabbitMqInitConfig) {
    const {
      delayStart,
      connection_url,
      prefetch,
      queues,
      exchanges,
      bindings,
      pre_init_promises,
      post_init_promises
    } = options;

    let retryAttempts = options.retryAttempts || 0;
    const retryDelay = options.retryDelay || 0;
    
    const init = () => {
      console.log(`Attempting connection to Rabbit MQ...`);
      return amqplib.connect(connection_url)
        .then((connection) => {
          this.connection = connection;
          console.log(`connected to message server`);
          return this.connection.createChannel();
        })
        .then((channel) => {
          this.channel = channel;
          if (prefetch) {
            this.channel.prefetch(prefetch || 1);
          }
          console.log(`channel created on message server`);
        })
        .then(() => {
          const promises: Promise<amqplib.Replies.AssertQueue>[] = [];
          // by default, create an observable stream on the queue for unidentified/null routing keys
          for (const queueConfig of queues) {
            this.queueToEventHandleMapping[queueConfig.name] = {};

            const queueListenersMap = this.queueToEventHandleMapping[queueConfig.name];
            queueListenersMap[this.DEFAULT_LISTENER_TYPE] = new Subject();
            for (const messageType of queueConfig.handleMessageTypes) {
              queueListenersMap[messageType] = new Subject();
            }
            promises.push(this.channel.assertQueue(queueConfig.name, queueConfig.options));
          }
          return Promise.all(promises).then((values) => {
            this.queues = mapify(values, 'queue');
            console.log(`queues created on channel`);
          })
        })
        .then(() => {
          const promises = exchanges.map((config) => this.channel.assertExchange(config.name, config.type, config.options));
          return Promise.all(promises).then(values => {
            this.exchanges = mapify(values, 'exchange');
            console.log(`exchanges created on channel`);
          });
        })
        .then(() => {
          const promises = bindings.map((config) => this.channel.bindQueue(config.queue, config.exchange, config.routingKey));
          return Promise.all(promises).then(values => {
            console.log(`bindings created on channel`);
          });
        })
        .then(() => {
          console.log(`Client initialization complete; waiting for messages/events...\n`);

          // initialization complete; listen for connection issues to retry again
          retryAttempts = options.retryAttempts;
          
          this.connection.on("error", (err) => {
            this.connectionErrorStream.next(err);
          });
          this.connection.on("close", (err) => {
            this.connectionErrorStream.next(err);
          });

          this.isReady = true;
          this.isReadyStream.next(true);
        })

        .catch((error) => {
          console.log(`connection error, retryAttempts: ${retryAttempts}`, error);
          if (retryAttempts === 0) {
            console.log(`all retry attemptys exhaused; exiting...`);
            throw error;
          }
          retryAttempts = retryAttempts - 1;
          return wait(retryDelay).then(init);
        });
    };

    wait(delayStart || 0)
    .then(() => {
      console.log(`Running pre init promises...`);
      return Promise.all(pre_init_promises?.map(p => p instanceof Promise ? p : p()) || []).then(() => {
        console.log(`Done running pre init promises.\n`);
      });
    })
    .then(init)
    .then(() => {
      console.log(`Running post init promises...`);
      return Promise.all(post_init_promises?.map(p => p instanceof Promise ? p : p()) || []).then(() => {
        console.log(`Done running post init promises. `);
      });
    });
  }

  getConnection() {
    return this.onReady.pipe(map(() => this.connection));
  }

  getChannel() {
    return this.onReady.pipe(map(() => this.channel));
  }

  onQueue(queue: string, options?: amqplib.Options.Consume) {
    // listen for messages on the queue
    if (!this.queueListeners[queue]) {
      const queueListener = new Observable<void>((observer) => {
        const handleCallback = (msg: amqplib.ConsumeMessage | null) => {
          if (!msg) {
            console.log('Consumer cancelled by server');
            observer.error();
            return;
          }
          
          // see if a listener was created for the routing key
          const messageType = msg.properties.type;
          const useContentType = msg.properties.contentType;
          const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].deserialize(msg.content) : msg.content;
          const messageObj: RmqEventMessage = { data: useData, message: msg };

          // console.log({ messageObj });

          if (!messageType) {
            // no type key found, push to default stream
            this.queueToEventHandleMapping[queue][this.DEFAULT_LISTENER_TYPE].next(messageObj);
          }
          else {
            // type key found
            if (this.queueToEventHandleMapping[queue][messageType]) {
              // there is a registered listener for the type, push to that stream
              this.queueToEventHandleMapping[queue][messageType].next(messageObj);
            }
            else {
              // no registered listener
              throw new Error(`Message received with unregistered routing key. Please add routing key "${messageType}" in the list of routing keys for the queue config in the constructor.`);
            }
          }
        };

        const consumerTag = Date.now().toString();
  
        this.channel.consume(queue, handleCallback, { ...(options || {}), consumerTag: options?.consumerTag || consumerTag });
      });

      this.queueListeners[queue] = this.onReady.pipe(mergeMap((ready: boolean, index: number) => queueListener)).subscribe();
    }
    
    const handle = (messageType: string) => {
      return this.onReady.pipe(
        mergeMap((ready: boolean, index: number) => {
          if (!this.queueToEventHandleMapping[queue][messageType]) {
            throw new Error(`The provided routing key was not provided during initialization. Please add routing key "${messageType}" in the list of routing keys for the queue config in the constructor.`);
          }
          return this.queueToEventHandleMapping[queue][messageType].asObservable();
        })
      );
    };

    const handleDefault = () => {
      return this.onReady.pipe(
        mergeMap((ready: boolean, index: number) => this.queueToEventHandleMapping[queue]['__default'].asObservable())
      );
    }

    return {
      handle,
      handleDefault
    }
  }

  ack(message: amqplib.ConsumeMessage) {
    this.channel.ack(message);
    console.log(`Acknoledged message.`);
  }

  sendMessage(options: {
    queue: string,
    data: any,
    publishOptions: amqplib.Options.Publish
  }) {
    const send = () => {
      const { data, publishOptions, queue } = options;
      const useContentType = publishOptions.contentType || ContentTypes.TEXT;
      const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].serialize(data) : data;
      this.channel.sendToQueue(queue, useData, publishOptions);
    };

    if (!this.isReady) {
      console.log(`wait until ready to send message`);
      firstValueFrom(this.onReady).then((readyState) => {
        console.log(`now ready to publish event`, { readyState });
        send();
      });
    }
    else {
      console.log(`is ready to send message`);
      send();
    }
  }

  sendRequest <T = any> (options: {
    queue: string,
    data: any,
    publishOptions: amqplib.Options.Publish
  }) {
    if (!options.publishOptions.replyTo) {
      throw new Error(`replyTo queue must be specified`);
    }
    if (!options.publishOptions.correlationId) {
      throw new Error(`correlationId queue must be specified`);
    }

    return new Promise<RmqEventMessage<ServiceMethodResults<T>>>((resolve, reject) => {
      const start_time = Date.now();

      const send = () => {
        const { data, publishOptions, queue } = options;
        const useContentType = publishOptions.contentType || ContentTypes.TEXT;
        const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].serialize(data) : data;
        this.channel.sendToQueue(queue, useData, publishOptions);
      };

      const awaitResponse = () => {
        const consumerTag = Date.now().toString();
        console.log(`awaiting response`, { consumerTag });

        this.channel.consume(options.publishOptions.replyTo!, (message: amqplib.ConsumeMessage | null) => {
          if (message && message?.properties.correlationId === options.publishOptions.correlationId) {
            const useContentType = message.properties.contentType;
            const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].deserialize(message.content) : message.content;
            const messageObj: RmqEventMessage = { data: useData, message };
            const end_time = Date.now();
            const total_time = (end_time - start_time) / 1000;
            const time_in_seconds = total_time.toFixed();
            console.log(`received response`, { consumerTag, options, messageObj, start_time, end_time, total_time, time_in_seconds });
            (messageObj.data as ServiceMethodResults<T>).error ? reject(messageObj) : resolve(messageObj);
            this.ack(message);
            this.channel.cancel(consumerTag);
            console.log(`Closing consumer via tag:`, { consumerTag });
          }
        }, { consumerTag });
      };

      if (!this.isReady) {
        console.log(`wait until ready to send message`);
        firstValueFrom(this.onReady).then((readyState) => {
          console.log(`now ready to publish event`, { readyState });
          awaitResponse(); // first listen on the reply queue
          send(); // then send the rpc/rmq message
        });
      }
      else {
        console.log(`is ready to send message`);
        awaitResponse();
        send();
      }
    });
  }

  publishEvent(options: {
    exchange: string,
    data: ServiceMethodResults,
    routingKey: string,
    publishOptions: amqplib.Options.Publish
  }) {
    const publish = () => {
      const { data, routingKey, publishOptions, exchange } = options;
      const useContentType = publishOptions.contentType || ContentTypes.TEXT;
      const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].serialize(data) : data;
      this.channel.publish(exchange, routingKey, useData, publishOptions);
    };

    if (!this.isReady) {
      console.log(`wait until ready to publish event`);
      this.onReady.subscribe({
        next: (readyState) => {
          console.log(`now ready to publish event`, { readyState });
          readyState && publish();
        }
      });
    }
    else {
      console.log(`is ready to publish event`);
      publish();
    }
  }

  listen() {
    const listenerCallback = () => {
      // console.log(`--- listening... ---`);
    };
    const interval = setInterval(listenerCallback, 1000 * 60);
    return interval;
  }
}
