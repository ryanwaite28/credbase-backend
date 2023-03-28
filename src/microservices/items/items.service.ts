import {
  RabbitMQClient,
  RmqEventMessage,
  ServiceMethodResults
} from "@lib/backend-shared";
import {
  ContentTypes,
  CreateItemDto,
  HttpStatusCode,
  ItemsQueueEventTypes,
  ItemsQueueMessageTypes,
  MicroservicesExchanges,
  RoutingKeys
} from "@lib/fullstack-shared";
import {
  create_item,
  get_items_by_asset_id,
  get_items_by_asset_id_paginate,
  get_items_by_client_id,
  get_items_by_client_id_paginate,
  get_item_by_id,
  get_item_by_uuid,
  get_item_fields_by_item_id,
  get_item_fields_by_item_id_paginate,
  get_item_fields_by_parent_field_id,
  get_item_fields_by_parent_field_id_paginate,
  get_item_field_by_id,
  get_item_field_by_uuid,
  get_item_with_fields_by_id
} from "./items.repo";








export async function FETCH_ITEM_WITH_FIELDS_BY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_WITH_FIELDS_BY_ID}] Received message:`);

  const data = await get_item_with_fields_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_WITH_FIELDS_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEM_BY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_BY_ID}] Received message:`);

  const data = await get_item_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEM_BY_UUID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_BY_UUID}] Received message:`);

  const data = await get_item_by_uuid(event.data.uuid);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_BY_UUID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEM_FIELD_BY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_FIELD_BY_ID}] Received message:`);

  const data = await get_item_field_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_FIELD_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEM_FIELD_BY_UUID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_FIELD_BY_UUID}] Received message:`);

  const data = await get_item_field_by_uuid(event.data.uuid);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_FIELD_BY_UUID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEMS_BY_CLIENT_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEMS_BY_CLIENT_ID}] Received message:`);

  const data = await get_items_by_client_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEMS_BY_CLIENT_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEMS_BY_CLIENT_ID_PAGINATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEMS_BY_CLIENT_ID_PAGINATE}] Received message:`);

  const data = await get_items_by_client_id_paginate({
    client_id: event.data.client_id,
    min_id:  event.data.min_id,
    limit: event.data.limit,
  });

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEMS_BY_CLIENT_ID_PAGINATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}


export async function FETCH_ITEMS_BY_ASSET_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEMS_BY_ASSET_ID}] Received message:`);

  const data = await get_items_by_asset_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEMS_BY_ASSET_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEMS_BY_ASSET_ID_PAGINATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEMS_BY_ASSET_ID_PAGINATE}] Received message:`);

  const data = await get_items_by_asset_id_paginate({
    asset_id: event.data.asset_id,
    min_id:  event.data.min_id,
    limit: event.data.limit,
  });

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEMS_BY_ASSET_ID_PAGINATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEM_FIELDS_BY_ITEM_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_FIELDS_BY_ITEM_ID}] Received message:`);

  const data = await get_item_fields_by_item_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_FIELDS_BY_ITEM_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEM_FIELDS_BY_ITEM_ID_PAGIATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_FIELDS_BY_ITEM_ID_PAGIATE}] Received message:`);

  const data = await get_item_fields_by_item_id_paginate({
    item_id: event.data.item_id,
    min_id:  event.data.min_id,
    limit: event.data.limit,
  });

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_FIELDS_BY_ITEM_ID_PAGIATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID}] Received message:`);

  const data = await get_item_fields_by_parent_field_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_FIELDS_BY_PARENT_FIELD_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE}] Received message:`);

  const data = await get_item_fields_by_parent_field_id_paginate({
    parent_field_id: event.data.parent_field_id,
    min_id:  event.data.min_id,
    limit: event.data.limit,
  });

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.FETCHED_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function CREATE_ITEM(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ItemsQueueMessageTypes.CREATE_ITEM}] Received message:`);

  const data = await create_item(event.data as CreateItemDto);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ITEM_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ItemsQueueEventTypes.ITEM_CREATED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}