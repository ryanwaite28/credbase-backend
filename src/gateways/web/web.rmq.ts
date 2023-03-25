import { AppEnvironment, RabbitMQClient } from "@lib/backend-shared";
import {
  MicroservicesExchanges,
  MicroservicesQueues,
  RoutingKeys,
  UsersQueueEventTypes,
  UsersQueueMessageTypes,
} from "@lib/fullstack-shared";




export const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.USER_MESSAGES, handleMessageTypes: Object.values(UsersQueueMessageTypes), options: { durable: true } },
    { name: MicroservicesQueues.USER_EVENTS, handleMessageTypes: Object.values(UsersQueueEventTypes), options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.USER_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [
    { queue: MicroservicesQueues.USER_EVENTS, exchange: MicroservicesExchanges.USER_EVENTS, routingKey: RoutingKeys.EVENT },
  ],

  pre_init_promises: []
});