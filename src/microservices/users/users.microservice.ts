
import { RmqEventMessage, RabbitMQClient } from "@lib/backend-shared";
import {
  MicroservicesQueues,
  UsersQueueMessageTypes,
  UsersQueueEventTypes,
  MicroservicesExchanges,
  RoutingKeys
} from "@lib/fullstack-shared";
import {
  CREATE_USER,
  FETCH_USER_BY_ID,
  FETCH_USER_BY_EMAIL,
  UPDATE_USER,
  LOGIN_USER,
  FETCH_USERS,
  DELETE_USER
} from "./users.service";
import { users_db_init } from "./users.database";



const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBIT_MQ_URL'] || '',
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.USER_MESSAGES, messageTypes: Object.values(UsersQueueMessageTypes), options: { durable: true } },
    { name: MicroservicesQueues.USER_EVENTS, messageTypes: Object.values(UsersQueueEventTypes), options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.USER_MESSAGES, type: 'direct', options: { durable: true } },
    { name: MicroservicesExchanges.USER_EVENTS, type: 'direct', options: { durable: true } },
  ],
  bindings: [
    { queue: MicroservicesQueues.USER_MESSAGES, exchange: MicroservicesExchanges.USER_MESSAGES, routingKey: RoutingKeys.MESSAGE },
    { queue: MicroservicesQueues.USER_EVENTS, exchange: MicroservicesExchanges.USER_EVENTS, routingKey: RoutingKeys.EVENT },
  ],

  pre_init_promises: [
    users_db_init
  ]
});



const usersQueue = rmqClient.onQueue(MicroservicesQueues.USER_MESSAGES);



usersQueue.handle(UsersQueueMessageTypes.FETCH_USERS).subscribe({
  next: (event: RmqEventMessage) => FETCH_USERS(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.FETCH_USER_BY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_USER_BY_ID(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.FETCH_USER_BY_EMAIL).subscribe({
  next: (event: RmqEventMessage) => FETCH_USER_BY_EMAIL(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.LOGIN_USER).subscribe({
  next: (event: RmqEventMessage) => LOGIN_USER(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.CREATE_USER).subscribe({
  next: (event: RmqEventMessage) => CREATE_USER(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.UPDATE_USER).subscribe({
  next: (event: RmqEventMessage) => UPDATE_USER(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.DELETE_USER).subscribe({
  next: (event: RmqEventMessage) => DELETE_USER(event, rmqClient)
});
