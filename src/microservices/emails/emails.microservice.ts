import {
  RabbitMQClient,
  MicroservicesQueues,
  UsersQueueEventTypes,
  MicroservicesExchanges,
  RoutingKeys,
  EventMessage
} from "@lib/shared";
import {
  USER_CREATED,
  USERS_FETCHED
} from "./emails.service";




const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBIT_MQ_URL'] || '',
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.EMAILS, messageTypes: Object.values(UsersQueueEventTypes), options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.USER_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [
    { queue: MicroservicesQueues.EMAILS, exchange: MicroservicesExchanges.USER_EVENTS, routingKey: RoutingKeys.EVENT },
  ]
});



const usersQueue = rmqClient.onQueue(MicroservicesQueues.EMAILS);


usersQueue.handle(UsersQueueEventTypes.USERS_FETCHED).subscribe({
  next: (event: EventMessage) => USERS_FETCHED(event, rmqClient)
});

usersQueue.handle(UsersQueueEventTypes.USER_CREATED).subscribe({
  next: (event: EventMessage) => USER_CREATED(event, rmqClient)
});
