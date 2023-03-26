import {
  RmqEventMessage,
  RabbitMQClient,
  ServiceMethodResults
} from "@lib/backend-shared";
import {
  CacheQueueEventTypes,
  CacheQueueMessageTypes,
  ContentTypes,
  HttpStatusCode,
  MicroservicesExchanges,
  RoutingKeys
} from "@lib/fullstack-shared";
import { RedisCacheClient } from "./cache.redis";



export async function FETCH_DATA(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${CacheQueueMessageTypes.FETCH_DATA}] Received message:`);

  const data = await RedisCacheClient.get(event.data.key);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: { key: event.data.key, value: data }
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CACHE_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: CacheQueueEventTypes.FETCHED_DATA,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}

export async function ADD_DATA(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${CacheQueueMessageTypes.ADD_DATA}] Received message:`);

  await RedisCacheClient.set(event.data.key, event.data.value);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: event.data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CACHE_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: CacheQueueEventTypes.ADDED_DATA,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}

export async function REMOVE_DATA(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${CacheQueueMessageTypes.REMOVE_DATA}] Received message:`);

  await RedisCacheClient.delete(event.data.key);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: event.data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CACHE_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: CacheQueueEventTypes.REMOVED_DATA,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}