import { AppEnvironment, RabbitMQClient, RmqEventMessage } from "@lib/backend-shared";
import { AuthoritiesQueueEventTypes, MicroservicesExchanges, MicroservicesQueues, RoutingKeys, UsersQueueEventTypes } from "@lib/fullstack-shared";
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
  connection_url: AppEnvironment.RABBIT_MQ_URL,
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
    // { queue: MicroservicesQueues.EMAILS, exchange: MicroservicesExchanges.ASSET_EVENTS, routingKey: RoutingKeys.EVENT },
  ]
});



const emailsQueue = rmqClient.onQueue(MicroservicesQueues.EMAILS);



emailsQueue.handle(UsersQueueEventTypes.USER_CREATED).subscribe({
  next: (event: RmqEventMessage) => USER_CREATED(event, rmqClient)
});

emailsQueue.handle(UsersQueueEventTypes.USER_DELETED).subscribe({
  next: (event: RmqEventMessage) => USER_DELETED(event, rmqClient)
});



emailsQueue.handle(AuthoritiesQueueEventTypes.AUTHORITY_CREATED).subscribe({
  next: (event: RmqEventMessage) => AUTHORITY_CREATED(event, rmqClient)
});

emailsQueue.handle(AuthoritiesQueueEventTypes.AUTHORITY_DELETED).subscribe({
  next: (event: RmqEventMessage) => AUTHORITY_DELETED(event, rmqClient)
});