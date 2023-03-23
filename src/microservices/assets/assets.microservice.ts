
import { RmqEventMessage, RabbitMQClient, AppEnvironment } from "@lib/backend-shared";
import {
  MicroservicesQueues,
  AssetsQueueMessageTypes,
  AssetsQueueEventTypes,
  MicroservicesExchanges,
  RoutingKeys,
} from "@lib/fullstack-shared";
import { assets_db_init } from "./assets.database";
import {
  CREATE_ASSET,
  DELETE_ASSET,
  FETCH_ASSETS_BY_AUTHORITY_ID,
  FETCH_ASSETS_BY_AUTHORITY_ID_PAGINATE,
  FETCH_ASSET_BY_ID,
  FETCH_ASSET_BY_UUID,
  UPDATE_ASSET
} from "./assets.service";




const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.ASSET_MESSAGES, messageTypes: Object.values(AssetsQueueMessageTypes), options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.ASSET_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [],

  pre_init_promises: [
    assets_db_init
  ]
});



const assetsQueue = rmqClient.onQueue(MicroservicesQueues.ASSET_MESSAGES);



assetsQueue.handle(AssetsQueueMessageTypes.FETCH_ASSET_BY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ASSET_BY_ID(event, rmqClient)
});

assetsQueue.handle(AssetsQueueMessageTypes.FETCH_ASSET_BY_UUID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ASSET_BY_UUID(event, rmqClient)
});

assetsQueue.handle(AssetsQueueMessageTypes.FETCH_ASSETS_BY_AUTHORITY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ASSETS_BY_AUTHORITY_ID(event, rmqClient)
});

assetsQueue.handle(AssetsQueueMessageTypes.FETCH_ASSETS_BY_AUTHORITY_ID_PAGINATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_ASSETS_BY_AUTHORITY_ID_PAGINATE(event, rmqClient)
});



assetsQueue.handle(AssetsQueueMessageTypes.CREATE_ASSET).subscribe({
  next: (event: RmqEventMessage) => CREATE_ASSET(event, rmqClient)
});

assetsQueue.handle(AssetsQueueMessageTypes.UPDATE_ASSET).subscribe({
  next: (event: RmqEventMessage) => UPDATE_ASSET(event, rmqClient)
});

assetsQueue.handle(AssetsQueueMessageTypes.DELETE_ASSET).subscribe({
  next: (event: RmqEventMessage) => DELETE_ASSET(event, rmqClient)
});