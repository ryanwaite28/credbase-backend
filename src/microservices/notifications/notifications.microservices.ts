import { AppEnvironment, QueueExchangeBindingConfig, RabbitMQClient } from "@lib/backend-shared";
import {
  MicroservicesExchanges,
  MicroservicesQueues,
  NotificationsQueueMessageTypes,
  RoutingKeys,
} from "@lib/fullstack-shared";




const handleMessageTypes = [
  ...Object.values(NotificationsQueueMessageTypes)
];


const exchanges = [
  MicroservicesExchanges.EMAIL_EVENTS,
  MicroservicesExchanges.USER_EVENTS,
  // MicroservicesExchanges.AUTHORITY_EVENTS,
  // MicroservicesExchanges.CLIENT_EVENTS,
  // MicroservicesExchanges.ASSET_EVENTS,
  // MicroservicesExchanges.ITEM_EVENTS,
  // MicroservicesExchanges.STORAGE_EVENTS,
  // MicroservicesExchanges.DEVELOPER_EVENTS,
  // MicroservicesExchanges.STRIPE_EVENTS,
];

const useBindings: QueueExchangeBindingConfig[] = exchanges.map((exchange) => ({ queue: MicroservicesQueues.LOGGING, exchange, routingKey: RoutingKeys.EVENT }));

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