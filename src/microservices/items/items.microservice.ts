import {
  AppEnvironment,
  RabbitMQClient,
  RmqEventMessage
} from "@lib/backend-shared";
import {
  ItemsQueueMessageTypes,
  MicroservicesExchanges,
  MicroservicesQueues
} from "@lib/fullstack-shared";
import { items_db_init } from "./items.database";
import {
  CREATE_ITEM,
  FETCH_ITEMS_BY_ASSET_ID,
  FETCH_ITEMS_BY_ASSET_ID_PAGINATE,
  FETCH_ITEMS_BY_CLIENT_ID,
  FETCH_ITEMS_BY_CLIENT_ID_PAGINATE,
  FETCH_ITEM_BY_ID,
  FETCH_ITEM_BY_UUID,
  FETCH_ITEM_FIELDS_BY_ITEM_ID,
  FETCH_ITEM_FIELDS_BY_ITEM_ID_PAGIATE,
  FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID,
  FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE,
  FETCH_ITEM_FIELD_BY_ID,
  FETCH_ITEM_FIELD_BY_UUID,
  FETCH_ITEM_WITH_FIELDS_BY_ID
} from "./items.service";



const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.ITEM_MESSAGES, handleMessageTypes: Object.values(ItemsQueueMessageTypes), options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.ITEM_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [],

  pre_init_promises: [
    items_db_init
  ]
});



const itemsQueue = rmqClient.onQueue(MicroservicesQueues.ITEM_MESSAGES);




itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_WITH_FIELDS_BY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_WITH_FIELDS_BY_ID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_BY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_BY_ID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_BY_UUID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_BY_UUID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_FIELD_BY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_FIELD_BY_ID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_FIELD_BY_UUID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_FIELD_BY_UUID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEMS_BY_CLIENT_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEMS_BY_CLIENT_ID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEMS_BY_CLIENT_ID_PAGINATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEMS_BY_CLIENT_ID_PAGINATE(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEMS_BY_ASSET_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEMS_BY_ASSET_ID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEMS_BY_ASSET_ID_PAGINATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEMS_BY_ASSET_ID_PAGINATE(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_FIELDS_BY_ITEM_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_FIELDS_BY_ITEM_ID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_FIELDS_BY_ITEM_ID_PAGIATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_FIELDS_BY_ITEM_ID_PAGIATE(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE(event, rmqClient)
});

itemsQueue.handle(ItemsQueueMessageTypes.CREATE_ITEM).subscribe({
  next: (event: RmqEventMessage) => CREATE_ITEM(event, rmqClient)
});

