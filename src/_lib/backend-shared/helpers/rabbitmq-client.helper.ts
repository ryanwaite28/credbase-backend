import { ContentTypes, mapify, MapType, uniqueValue, wait } from "@lib/fullstack-shared";
import * as amqplib from "amqplib";
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  take,
  tap,
} from "rxjs";
import { AppEnvironment } from "../environment/app.enviornment";
import { ServiceMethodResults } from "../interfaces/common.interface";
import { SERIALIZERS } from "../utils/serializers.utils";
import { v1 as uuidv1 } from 'uuid';



export interface QueueConfig { name: string, handleMessageTypes: string[], options?: amqplib.Options.AssertQueue }
export interface ExchangeConfig { name: string, type: string, options?: amqplib.Options.AssertExchange }
export interface QueueExchangeBindingConfig { queue: string, exchange: string, routingKey: string }

export type RmqEventMessage<T = any> = {
  data: T,
  message: amqplib.ConsumeMessage,
  metadata: {
    env?: string,
    // appName?: any,
    isEnv?: any,
  }
};

export type AckFn = (message: amqplib.Message) => void;

export type RabbitMqInitConfig = {
  dontSendToReplyQueueOnPublish?: boolean,
  autoAckUnhandledMessageTypes?: boolean,
  pushUnhandledMessageTypesToDefaultHandler?: boolean,
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
  private clientInitConfig: RabbitMqInitConfig;

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

  private EXCLUSIVE_QUEUE: string = uuidv1();

  private queueListeners: MapType<Subscription> = {};
  private queueToEventHandleMapping: MapType<
    MapType<ReplaySubject<RmqEventMessage>>
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

  constructor(clientInitConfig: RabbitMqInitConfig) {
    this.clientInitConfig = clientInitConfig;
    const {
      delayStart,
      connection_url,
      prefetch,
      queues,
      exchanges,
      bindings,
      pre_init_promises,
      post_init_promises
    } = clientInitConfig;

    let retryAttempts = clientInitConfig.retryAttempts || 0;
    const retryDelay = clientInitConfig.retryDelay || 0;
    
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
          // create an exclusive queue for this channel connection
          console.log(`Creating exclusive queue ${this.EXCLUSIVE_QUEUE} for client ${AppEnvironment.APP_NAME.MACHINE}...`);
          return this.channel.assertQueue(this.EXCLUSIVE_QUEUE, { exclusive: true, durable: false }).then((response) => {
            console.log(`Created exclusive queue ${this.EXCLUSIVE_QUEUE} for client ${AppEnvironment.APP_NAME.MACHINE}.`);
          });
        })
        .then(() => {
          const promises: Promise<amqplib.Replies.AssertQueue>[] = [];
          // by default, create an observable stream on the queue for unidentified/null routing keys
          for (const queueConfig of queues) {
            this.queueToEventHandleMapping[queueConfig.name] = {};

            const queueListenersMap = this.queueToEventHandleMapping[queueConfig.name];
            queueListenersMap[this.DEFAULT_LISTENER_TYPE] = new ReplaySubject();
            for (const messageType of queueConfig.handleMessageTypes) {
              queueListenersMap[messageType] = new ReplaySubject();
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
          // bind the exclusive queue to all the exchanges
          const exclusiveBindings = bindings.map((config) => this.channel.bindQueue(this.EXCLUSIVE_QUEUE, config.exchange, config.routingKey));
          return Promise.all([promises, exclusiveBindings]).then(values => {
            console.log(`bindings created on channel`);
          });
        })
        .then(() => {
          console.log(`Client initialization complete; waiting for messages/events...\n`);

          // initialization complete; listen for connection issues to retry again
          retryAttempts = clientInitConfig.retryAttempts;
          
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
      console.log(`Registering messages/events listener for queue ${queue}:`);
      const startQueueListener = () => {
        const handleCallback = (message: amqplib.ConsumeMessage | null) => {
          if (!message) {
            throw new Error('Consumer cancelled by server');
          }
          
          // see if a listener was created for the routing key
          const messageType = message.properties.type;
          const useContentType = message.properties.contentType;
          const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].deserialize(message.content) : message.content;
          const messageObj: RmqEventMessage = {
            data: useData,
            message,
            metadata: {
              env: AppEnvironment.APP_ENV,
              isEnv: AppEnvironment.IS_ENV,
            }
          };
          
          // console.log(`Message on queue ${queue}:`, messageObj);

          if (!messageType) {
            // no type key found, push to default stream
            console.log(`No message type found; pushing to default handler on queue ${queue}`);
            this.queueToEventHandleMapping[queue][this.DEFAULT_LISTENER_TYPE].next(messageObj);
          }
          else {
            // type key found
            if (this.queueToEventHandleMapping[queue][messageType]) {
              // there is a registered listener for the type, push to that stream
              console.log(`message type handler found; pushing to ${messageType} handler on queue ${queue}`);
              this.queueToEventHandleMapping[queue][messageType].next(messageObj);
            }
            else {
              // no registered listener
              if (this.clientInitConfig.autoAckUnhandledMessageTypes) {
                console.log(`No handler found for message type ${messageType} on queue ${queue}; auto acknowledging.`);
                this.ack(message);
                return;
              }
              else if (this.clientInitConfig.pushUnhandledMessageTypesToDefaultHandler) {
                console.log(`No handler found for message type ${messageType} on queue ${queue}; pushing to ${this.DEFAULT_LISTENER_TYPE} handler.`);
                this.queueToEventHandleMapping[queue][this.DEFAULT_LISTENER_TYPE].next(messageObj);
                return;
              }
              else {
                throw new Error(`Message received with unregistered message type handler. Please add message type "${messageType}" in the list of message types for the queue config in the constructor.`);
              }
            }
          }
        };

        const consumerTag = Date.now().toString();
  
        this.channel.consume(queue, handleCallback, { ...(options || {}), consumerTag: options?.consumerTag || consumerTag });
      }

      this.queueListeners[queue] = this.onReady.pipe(tap((readyState) => startQueueListener())).subscribe({
        next: (readyState) => {
          console.log(`Registered: Now listening to messages/events on queue ${queue}...`);
        }
      });
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
        mergeMap((ready: boolean, index: number) => this.queueToEventHandleMapping[queue][this.DEFAULT_LISTENER_TYPE].asObservable())
      );
    }

    return {
      handle,
      handleDefault
    }
  }

  ack(message: amqplib.ConsumeMessage) {
    this.channel.ack(message);
    console.log(`Acknoledged rmq message.`);
  }

  sendMessage(options: {
    queue: string,
    data: any,
    publishOptions: amqplib.Options.Publish
  }) {
    return new Promise((resolve, reject) => {
      const send = () => {
        const { data, publishOptions, queue } = options;
        const useContentType = publishOptions.contentType || ContentTypes.TEXT;
        const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].serialize(data) : data;
        this.channel.sendToQueue(queue, useData, publishOptions);
        resolve(undefined);
      };
  
      if (!this.isReady) {
        console.log(`wait until ready to send message...`);
        firstValueFrom(this.onReady).then((readyState) => {
          console.log(`now ready to send message`, { readyState });
          send();
        });
      }
      else {
        console.log(`is ready to send message`);
        send();
      }
    });
  }

  async sendRequest <T = any> (options: {
    queue: string,
    data: any,
    publishOptions: amqplib.Options.Publish,
  }) {
    return new Promise<RmqEventMessage<ServiceMethodResults<T>>>((resolve, reject) => {
      const start_time = Date.now();

      const correlationId = uniqueValue();

      const send = () => {
        const { data, publishOptions, queue } = options;
        const useContentType = publishOptions.contentType || ContentTypes.TEXT;
        const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].serialize(data) : data;
        this.channel.sendToQueue(queue, useData, { ...publishOptions, correlationId, replyTo: this.EXCLUSIVE_QUEUE });
      };

      const awaitResponse = () => {
        console.log(`request/rpc sent; awaiting response...`);

        const replyHandler = (message: amqplib.ConsumeMessage | null) => {
          const isReplyToRequest: boolean = !!message && message.properties.correlationId === correlationId;
          if (isReplyToRequest) {
            const useContentType = message!.properties.contentType;
            const useData = SERIALIZERS[useContentType] ? SERIALIZERS[useContentType].deserialize(message!.content) : message!.content;
            const messageObj: RmqEventMessage = {
              data: useData,
              message: message!,
              metadata: {
                env: AppEnvironment.APP_ENV,
                isEnv: AppEnvironment.IS_ENV,
              }
            };
            const end_time = Date.now();
            const total_time = (end_time - start_time) / 1000;
            const time_in_seconds = total_time.toFixed();
            console.log(`received response from request/rpc:`, { start_time, end_time, total_time, time_in_seconds, messageObj, options });
            (messageObj.data as ServiceMethodResults<T>).error ? reject(messageObj) : resolve(messageObj);
            this.ack(message!);
          }
        };

        this.channel.consume(this.EXCLUSIVE_QUEUE, replyHandler);
      };

      if (!this.isReady) {
        console.log(`wait until ready to send request`);
        firstValueFrom(this.onReady).then((readyState) => {
          console.log(`now ready to publish event`, { readyState });
          awaitResponse(); // first listen on the reply queue
          send(); // then send the rpc/rmq message
        });
      }
      else {
        console.log(`is ready to send request`);
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
    // last resort to keeping the node.js process running
    const listenerCallback = () => {
      console.log(`--- listening... ---`);
    };
    const interval = setInterval(listenerCallback, 1000 * 60 * 10);
    return interval;
  }
}
