import {
  EventMessage,
  MicroservicesExchanges,
  MicroservicesQueues,
  RabbitMQClient,
  RoutingKeys,
  UsersQueueEventTypes,
  UsersQueueMessageTypes
} from "@lib/shared";
import { users_db_init } from "./users.database";
import {
  CREATE_USER,
  FETCH_USER_BY_ID,
  FETCH_USER_BY_EMAIL,
  UPDATE_USER,
  LOGIN_USER,
  FETCH_USERS
} from "./users.service";


console.log(`RABBIT_MQ_URL`, process.env['RABBIT_MQ_URL'], '\n\n');

const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBIT_MQ_URL'] || '',
  delayStart: 5000,
  prefetch: 1,
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
  next: (event: EventMessage) => FETCH_USERS(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.FETCH_USER_BY_ID).subscribe({
  next: (event: EventMessage) => FETCH_USER_BY_ID(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.FETCH_USER_BY_EMAIL).subscribe({
  next: (event: EventMessage) => FETCH_USER_BY_EMAIL(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.CREATE_USER).subscribe({
  next: (event: EventMessage) => CREATE_USER(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.UPDATE_USER).subscribe({
  next: (event: EventMessage) => UPDATE_USER(event, rmqClient)
});

usersQueue.handle(UsersQueueMessageTypes.LOGIN_USER).subscribe({
  next: (event: EventMessage) => LOGIN_USER(event, rmqClient)
});