import {
  RabbitMQClient,
  RmqEventMessage,
  ServiceMethodResults
} from "@lib/backend-shared";
import {
  AssetsQueueMessageTypes,
  AssetsQueueEventTypes,
  ContentTypes,
  HttpStatusCode,
  MicroservicesExchanges,
  RoutingKeys,
  CreateAssetDto,
  UpdateAssetDto,
} from "@lib/fullstack-shared";
import {
  create_asset,
  delete_asset,
  get_assets_by_authority_id,
  get_assets_by_authority_id_paginate,
  get_asset_by_id,
  get_asset_by_uuid,
  update_asset
} from "./assets.repo";




export async function FETCH_ASSET_BY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AssetsQueueMessageTypes.FETCH_ASSET_BY_ID}] Received message:`);

  const asset = await get_asset_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: asset
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ASSET_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AssetsQueueEventTypes.FETCHED_ASSET_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ASSET_BY_UUID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AssetsQueueMessageTypes.FETCH_ASSET_BY_UUID}] Received message:`);

  const asset = await get_asset_by_uuid(event.data.uuid);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: asset
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ASSET_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AssetsQueueEventTypes.FETCHED_ASSET_BY_UUID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ASSETS_BY_AUTHORITY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AssetsQueueMessageTypes.FETCH_ASSETS_BY_AUTHORITY_ID}] Received message:`);

  const assets = await get_assets_by_authority_id(event.data.authority_id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: assets
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ASSET_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AssetsQueueEventTypes.FETCHED_ASSETS_BY_AUTHORITY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_ASSETS_BY_AUTHORITY_ID_PAGINATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AssetsQueueMessageTypes.FETCH_ASSETS_BY_AUTHORITY_ID_PAGINATE}] Received message:`);

  const assets = await get_assets_by_authority_id_paginate({
    authority_id: event.data.authority_id,
    min_id:  event.data.min_id,
    limit: event.data.limit,
  });

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: assets
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ASSET_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AssetsQueueEventTypes.FETCHED_ASSETS_BY_AUTHORITY_ID_PAGINATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}


export async function CREATE_ASSET(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AssetsQueueMessageTypes.CREATE_ASSET}] Received message:`);
  
  const asset = await create_asset(event.data as CreateAssetDto);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: asset
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ASSET_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AssetsQueueEventTypes.ASSET_CREATED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function UPDATE_ASSET(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AssetsQueueMessageTypes.UPDATE_ASSET}] Received message:`);

  const asset = await update_asset(event.data.id as number, event.data.updates as UpdateAssetDto);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: asset
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ASSET_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AssetsQueueEventTypes.ASSET_UPDATED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function DELETE_ASSET(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AssetsQueueMessageTypes.DELETE_ASSET}] Received message:`);

  const asset = await delete_asset(event.data.id as number);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: asset
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.ASSET_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AssetsQueueEventTypes.ASSET_DELETED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}