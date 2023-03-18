import {
  MicroservicesExchanges,
  MicroservicesQueues,
  RabbitMQClient,
  RoutingKeys,
  UsersQueueEventTypes,
  UsersQueueMessageTypes,
} from "@lib/shared";



console.log(`RABBIT_MQ_URL`, process.env['RABBIT_MQ_URL'], '\n\n');

export const rmqClient = new RabbitMQClient({
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

  pre_init_promises: []
});