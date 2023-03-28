import {
  AppEnvironment,
  QueueExchangeBindingConfig,
  RabbitMQClient,
  RmqEventMessage,
} from "@lib/backend-shared";
import {
  ClientsQueueEventTypes,
  ItemsQueueEventTypes,
  MicroservicesExchanges,
  MicroservicesQueues,
  NotificationsQueueMessageTypes,
  RoutingKeys,
} from "@lib/fullstack-shared";
import {
  FETCH_USER_NOTIFICATIONS_LAST_OPENED,
  FETCH_USER_NOTIFICATIONS,
  FETCH_USER_NOTIFICATIONS_PAGINATE,
  CREATE_USER_NOTIFICATION,
  FETCH_AUTHORITY_NOTIFICATIONS_LAST_OPENED,
  FETCH_AUTHORITY_NOTIFICATIONS,
  FETCH_AUTHORITY_NOTIFICATIONS_PAGINATE,
  CREATE_AUTHORITY_NOTIFICATION,
} from "./notifications.service";




const handleMessageTypes = [
  ...Object.values(NotificationsQueueMessageTypes),

  ClientsQueueEventTypes.ADDED_CLIENT_REQUEST,
  ClientsQueueEventTypes.CHECKED_CLIENT_REQUEST,
  ClientsQueueEventTypes.CHECKED_PENDING_CLIENT_REQUEST,
  ClientsQueueEventTypes.CANCELED_CLIENT_REQUEST,
  ClientsQueueEventTypes.ACCEPTED_CLIENT_REQUEST,
  ClientsQueueEventTypes.DECLINED_CLIENT_REQUEST,

  ItemsQueueEventTypes.ITEM_CREATED,
];


const exchanges = [
  // MicroservicesExchanges.CLIENT_EVENTS,
  // MicroservicesExchanges.ITEM_EVENTS,
];

const useBindings: QueueExchangeBindingConfig[] = exchanges.map((exchange) => ({ queue: MicroservicesQueues.NOTIFICATIONS, exchange, routingKey: RoutingKeys.EVENT }));

export const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  autoAckUnhandledMessageTypes: true,
  queues: [
    { name: MicroservicesQueues.NOTIFICATIONS, handleMessageTypes, options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.NOTIFICATION_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: useBindings,

  pre_init_promises: []
});


const notificationsQueue = rmqClient.onQueue(MicroservicesQueues.NOTIFICATIONS);


notificationsQueue.handle(NotificationsQueueMessageTypes.FETCH_USER_NOTIFICATIONS_LAST_OPENED).subscribe({
  next: (event: RmqEventMessage) => FETCH_USER_NOTIFICATIONS_LAST_OPENED(event, rmqClient)
});

notificationsQueue.handle(NotificationsQueueMessageTypes.FETCH_USER_NOTIFICATIONS).subscribe({
  next: (event: RmqEventMessage) => FETCH_USER_NOTIFICATIONS(event, rmqClient)
});

notificationsQueue.handle(NotificationsQueueMessageTypes.FETCH_USER_NOTIFICATIONS_PAGINATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_USER_NOTIFICATIONS_PAGINATE(event, rmqClient)
});

notificationsQueue.handle(NotificationsQueueMessageTypes.CREATE_USER_NOTIFICATION).subscribe({
  next: (event: RmqEventMessage) => CREATE_USER_NOTIFICATION(event, rmqClient)
});

notificationsQueue.handle(NotificationsQueueMessageTypes.FETCH_AUTHORITY_NOTIFICATIONS_LAST_OPENED).subscribe({
  next: (event: RmqEventMessage) => FETCH_AUTHORITY_NOTIFICATIONS_LAST_OPENED(event, rmqClient)
});

notificationsQueue.handle(NotificationsQueueMessageTypes.FETCH_AUTHORITY_NOTIFICATIONS).subscribe({
  next: (event: RmqEventMessage) => FETCH_AUTHORITY_NOTIFICATIONS(event, rmqClient)
});

notificationsQueue.handle(NotificationsQueueMessageTypes.FETCH_AUTHORITY_NOTIFICATIONS_PAGINATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_AUTHORITY_NOTIFICATIONS_PAGINATE(event, rmqClient)
});

notificationsQueue.handle(NotificationsQueueMessageTypes.CREATE_AUTHORITY_NOTIFICATION).subscribe({
  next: (event: RmqEventMessage) => CREATE_AUTHORITY_NOTIFICATION(event, rmqClient)
});
