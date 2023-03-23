import { RmqEventMessage, RabbitMQClient, AppEnvironment } from "@lib/backend-shared";
import {
  MicroservicesExchanges,
  MicroservicesQueues,
  RoutingKeys,
  AuthoritiesQueueEventTypes,
  AuthoritiesQueueMessageTypes
} from "@lib/fullstack-shared";
import { authorities_db_init } from "./authorities.database";
import {
  CREATE_AUTHORITY,
  FETCH_AUTHORITY_BY_ID,
  FETCH_AUTHORITY_BY_EMAIL,
  UPDATE_AUTHORITY,
  LOGIN_AUTHORITY,
  FETCH_AUTHORITIES,
  DELETE_AUTHORITY,
  FETCH_AUTHORITY_BY_UUID
} from "./authorities.service";



const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.AUTHORITY_MESSAGES, messageTypes: Object.values(AuthoritiesQueueMessageTypes), options: { durable: true } },
    { name: MicroservicesQueues.AUTHORITY_EVENTS, messageTypes: Object.values(AuthoritiesQueueEventTypes), options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.AUTHORITY_MESSAGES, type: 'fanout', options: { durable: true } },
    { name: MicroservicesExchanges.AUTHORITY_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [
    { queue: MicroservicesQueues.AUTHORITY_MESSAGES, exchange: MicroservicesExchanges.AUTHORITY_MESSAGES, routingKey: RoutingKeys.MESSAGE },
    { queue: MicroservicesQueues.AUTHORITY_EVENTS, exchange: MicroservicesExchanges.AUTHORITY_EVENTS, routingKey: RoutingKeys.EVENT },
  ],

  pre_init_promises: [
    authorities_db_init
  ]
});



const authoritiesQueue = rmqClient.onQueue(MicroservicesQueues.AUTHORITY_MESSAGES);



authoritiesQueue.handle(AuthoritiesQueueMessageTypes.FETCH_AUTHORITIES).subscribe({
  next: (event: RmqEventMessage) => FETCH_AUTHORITIES(event, rmqClient)
});

authoritiesQueue.handle(AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_AUTHORITY_BY_ID(event, rmqClient)
});

authoritiesQueue.handle(AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_UUID).subscribe({
  next: (event: RmqEventMessage) => FETCH_AUTHORITY_BY_UUID(event, rmqClient)
});

authoritiesQueue.handle(AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_EMAIL).subscribe({
  next: (event: RmqEventMessage) => FETCH_AUTHORITY_BY_EMAIL(event, rmqClient)
});

authoritiesQueue.handle(AuthoritiesQueueMessageTypes.LOGIN_AUTHORITY).subscribe({
  next: (event: RmqEventMessage) => LOGIN_AUTHORITY(event, rmqClient)
});

authoritiesQueue.handle(AuthoritiesQueueMessageTypes.CREATE_AUTHORITY).subscribe({
  next: (event: RmqEventMessage) => CREATE_AUTHORITY(event, rmqClient)
});

authoritiesQueue.handle(AuthoritiesQueueMessageTypes.UPDATE_AUTHORITY).subscribe({
  next: (event: RmqEventMessage) => UPDATE_AUTHORITY(event, rmqClient)
});

authoritiesQueue.handle(AuthoritiesQueueMessageTypes.DELETE_AUTHORITY).subscribe({
  next: (event: RmqEventMessage) => DELETE_AUTHORITY(event, rmqClient)
});
