import {
  AppEnvironment,
  RabbitMQClient,
  RmqEventMessage
} from "@lib/backend-shared";
import {
  CacheQueueMessageTypes,
  MicroservicesExchanges,
  MicroservicesQueues
} from "@lib/fullstack-shared";
import { FETCH_DATA, ADD_DATA, REMOVE_DATA } from "./cache.service";





const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  autoAckUnhandledMessageTypes: true,
  queues: [
    { name: MicroservicesQueues.CACHE_MESSAGES, handleMessageTypes: Object.values(CacheQueueMessageTypes), options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.CACHE_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: []
});


const cacheQueue = rmqClient.onQueue(MicroservicesQueues.CACHE_MESSAGES);



cacheQueue.handle(CacheQueueMessageTypes.FETCH_DATA).subscribe({
  next: (event: RmqEventMessage) => FETCH_DATA(event, rmqClient)
});

cacheQueue.handle(CacheQueueMessageTypes.ADD_DATA).subscribe({
  next: (event: RmqEventMessage) => ADD_DATA(event, rmqClient)
});

cacheQueue.handle(CacheQueueMessageTypes.REMOVE_DATA).subscribe({
  next: (event: RmqEventMessage) => REMOVE_DATA(event, rmqClient)
});