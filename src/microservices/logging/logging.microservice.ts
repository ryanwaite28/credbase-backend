import {
  RabbitMQClient,
  AppEnvironment,
  RmqEventMessage,
  QueueExchangeBindingConfig,
  LOGGER,
  ExchangeConfig
} from "@lib/backend-shared";
import {
  MicroservicesQueues,
  MicroservicesExchanges,
  RoutingKeys,
  AuthoritiesQueueEventTypes,
  UsersQueueEventTypes,
  ClientsQueueEventTypes,
  AssetsQueueEventTypes,
  ItemsQueueEventTypes,
  StoragesQueueEventTypes,
  EmailsQueueEventTypes,
  MapType,
  LogsQueueMessageTypes
} from "@lib/fullstack-shared";
import { Subscription } from "rxjs";




const handleMessageTypes: string[] = [
  ...Object.values(LogsQueueMessageTypes),
  ...Object.values(EmailsQueueEventTypes),
  ...Object.values(UsersQueueEventTypes),
  ...Object.values(AuthoritiesQueueEventTypes),
  ...Object.values(ClientsQueueEventTypes),
  ...Object.values(AssetsQueueEventTypes),
  ...Object.values(ItemsQueueEventTypes),
  ...Object.values(StoragesQueueEventTypes),
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

const useExchanges: ExchangeConfig[] = exchanges.map((exchange) => ({ name: exchange, type: 'fanout', options: { durable: true } }));

const useBindings: QueueExchangeBindingConfig[] = exchanges.map((exchange) => ({ queue: MicroservicesQueues.LOGGING, exchange, routingKey: RoutingKeys.EVENT }));




const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.LOGGING, handleMessageTypes, options: { durable: true } },
  ],
  exchanges: useExchanges,
  bindings: useBindings
});




const loggingQueue = rmqClient.onQueue(MicroservicesQueues.LOGGING);

const subsMap: MapType<Subscription> = {};

for (const messageType of handleMessageTypes) {
  subsMap[messageType] = loggingQueue.handle(messageType).subscribe({
    next: (event: RmqEventMessage) => {
      rmqClient.ack(event.message);

      LOGGER.info(messageType, {
        messageType,
        event: {
          fields: event.message.fields,
          properties: event.message.properties,
          data: event.data,
          metadata: event.metadata
        },
      });
    }
  });
}
