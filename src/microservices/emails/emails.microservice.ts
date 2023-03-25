import {
  AppEnvironment,
  RabbitMQClient,
  RmqEventMessage
} from "@lib/backend-shared";
import {
  AuthoritiesQueueEventTypes,
  ClientsQueueMessageTypes,
  EmailsQueueMessageTypes,
  MicroservicesExchanges,
  MicroservicesQueues,
  UsersQueueEventTypes,
  RoutingKeys,
} from "@lib/fullstack-shared";
import {
  AUTHORITY_CREATED,
  AUTHORITY_DELETED,
  USER_CREATED,
  USER_DELETED
} from "./emails.service";




const handleMessageTypes: string[] = [
  ...Object.values(EmailsQueueMessageTypes),

  ClientsQueueMessageTypes.ADD_CLIENT,

  UsersQueueEventTypes.USER_CREATED,
  UsersQueueEventTypes.USER_DELETED,
  AuthoritiesQueueEventTypes.AUTHORITY_CREATED,
  AuthoritiesQueueEventTypes.AUTHORITY_DELETED,
];

const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  autoAckUnhandledMessageTypes: true,
  queues: [
    { name: MicroservicesQueues.EMAILS, handleMessageTypes, options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.EMAIL_EVENTS, type: 'fanout', options: { durable: true } },
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


// // for other unwanted messages, get them from the default queue and ack
// emailsQueue.handleDefault().subscribe({
//   next: (event: RmqEventMessage) => {
//     console.log(`Handling unwanted message`, event);
//     rmqClient.ack(event.message);
//   }
// });