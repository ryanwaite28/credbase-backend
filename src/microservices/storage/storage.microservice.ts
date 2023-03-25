import {
  RabbitMQClient,
  AppEnvironment,
  RmqEventMessage
} from "@lib/backend-shared";
import {
  MicroservicesQueues,
  StoragesQueueMessageTypes,
  MicroservicesExchanges
} from "@lib/fullstack-shared";
import { storage_db_init } from "./storage.database";
import {
  FETCH_S3OBJECT_BY_ID,
  FETCH_S3OBJECTS_BY_MODEL,
  DELETE_S3OBJECT_BY_ID,
  DELETE_S3OBJECTS_BY_MODEL,
  CREATE_S3OBJECT
} from "./storage.service";





const handleMessageTypes: string[] = [
  ...Object.values(StoragesQueueMessageTypes),
];

const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.STORAGE_MESSAGES, handleMessageTypes, options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.STORAGE_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [
  ],

  pre_init_promises: [
    storage_db_init
  ]
});



const storageQueue = rmqClient.onQueue(MicroservicesQueues.USER_MESSAGES);



storageQueue.handle(StoragesQueueMessageTypes.FETCH_S3OBJECT_BY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_S3OBJECT_BY_ID(event, rmqClient)
});

storageQueue.handle(StoragesQueueMessageTypes.FETCH_S3OBJECTS_BY_MODEL).subscribe({
  next: (event: RmqEventMessage) => FETCH_S3OBJECTS_BY_MODEL(event, rmqClient)
});

storageQueue.handle(StoragesQueueMessageTypes.DELETE_S3OBJECT_BY_ID).subscribe({
  next: (event: RmqEventMessage) => DELETE_S3OBJECT_BY_ID(event, rmqClient)
});

storageQueue.handle(StoragesQueueMessageTypes.DELETE_S3OBJECTS_BY_MODEL).subscribe({
  next: (event: RmqEventMessage) => DELETE_S3OBJECTS_BY_MODEL(event, rmqClient)
});

storageQueue.handle(StoragesQueueMessageTypes.CREATE_S3OBJECT).subscribe({
  next: (event: RmqEventMessage) => CREATE_S3OBJECT(event, rmqClient)
});