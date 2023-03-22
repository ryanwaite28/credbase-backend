import {
  RabbitMQClient,
  MicroservicesQueues,
  UsersQueueEventTypes,
  MicroservicesExchanges,
  RoutingKeys,
  EventMessage,
  AuthoritiesQueueEventTypes
} from "@lib/shared";
import {
  AUTHORITY_CREATED,
  AUTHORITY_DELETED,
  USER_CREATED,
  USER_DELETED
} from "./emails.service";




const handleMessageTypes: string[] = [
  ...Object.values(UsersQueueEventTypes),
  ...Object.values(AuthoritiesQueueEventTypes),
];

const rmqClient = new RabbitMQClient({
  connection_url: process.env['RABBIT_MQ_URL'] || '',
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.EMAILS, messageTypes: handleMessageTypes, options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.USER_EVENTS, type: 'fanout', options: { durable: true } },
    { name: MicroservicesExchanges.AUTHORITY_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [
    { queue: MicroservicesQueues.EMAILS, exchange: MicroservicesExchanges.USER_EVENTS, routingKey: RoutingKeys.EVENT },
    { queue: MicroservicesQueues.EMAILS, exchange: MicroservicesExchanges.AUTHORITY_EVENTS, routingKey: RoutingKeys.EVENT },
  ]
});



const emailsQueue = rmqClient.onQueue(MicroservicesQueues.EMAILS);



emailsQueue.handle(UsersQueueEventTypes.USER_CREATED).subscribe({
  next: (event: EventMessage) => USER_CREATED(event, rmqClient)
});

emailsQueue.handle(UsersQueueEventTypes.USER_DELETED).subscribe({
  next: (event: EventMessage) => USER_DELETED(event, rmqClient)
});



emailsQueue.handle(AuthoritiesQueueEventTypes.AUTHORITY_CREATED).subscribe({
  next: (event: EventMessage) => AUTHORITY_CREATED(event, rmqClient)
});

emailsQueue.handle(AuthoritiesQueueEventTypes.AUTHORITY_DELETED).subscribe({
  next: (event: EventMessage) => AUTHORITY_DELETED(event, rmqClient)
});