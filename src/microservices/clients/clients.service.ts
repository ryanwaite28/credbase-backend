import {
  RabbitMQClient,
  RmqEventMessage,
  ServiceMethodResults,
} from "@lib/backend-shared";
import {
  AddClientDto,
  ClientsQueueEventTypes,
  ClientsQueueMessageTypes,
  ContentTypes,
  HttpStatusCode,
  MicroservicesExchanges,
  RoutingKeys,
} from "@lib/fullstack-shared";
import {
  get_client_by_id,
  get_client_by_uuid,
  get_clients_by_authority_id,
  get_clients_by_authority_id_paginate,
  add_client,
  get_clients_by_user_id,
  get_clients_by_user_id_paginate,
} from "./clients.repo";



export async function FETCH_CLIENT_BY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ClientsQueueMessageTypes.FETCH_CLIENT_BY_ID}] Received message:`);

  const client = await get_client_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: client
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CLIENT_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ClientsQueueEventTypes.FETCHED_CLIENT_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_CLIENT_BY_UUID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ClientsQueueMessageTypes.FETCH_CLIENT_BY_UUID}] Received message:`);

  const client = await get_client_by_uuid(event.data.uuid);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: client
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CLIENT_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ClientsQueueEventTypes.FETCHED_CLIENT_BY_UUID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_CLIENTS_BY_AUTHORITY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ClientsQueueMessageTypes.FETCH_CLIENTS_BY_AUTHORITY_ID}] Received message:`);

  const clients = await get_clients_by_authority_id(event.data.authority_id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: clients
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CLIENT_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ClientsQueueEventTypes.FETCHED_CLIENTS_BY_AUTHORITY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_CLIENTS_BY_AUTHORITY_ID_PAGINATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ClientsQueueMessageTypes.FETCH_CLIENTS_BY_AUTHORITY_ID_PAGINATE}] Received message:`);

  const clients = await get_clients_by_authority_id_paginate({
    authority_id: event.data.authority_id,
    min_id:  event.data.min_id,
    limit: event.data.limit,
  });

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: clients
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CLIENT_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ClientsQueueEventTypes.FETCHED_CLIENTS_BY_AUTHORITY_ID_PAGINATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_CLIENTS_BY_USER_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ClientsQueueMessageTypes.FETCH_CLIENTS_BY_USER_ID}] Received message:`);

  const clients = await get_clients_by_user_id(event.data.user_id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: clients
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CLIENT_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ClientsQueueEventTypes.FETCHED_CLIENTS_BY_USER_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_CLIENTS_BY_USER_ID_PAGINATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ClientsQueueMessageTypes.FETCH_CLIENTS_BY_USER_ID_PAGINATE}] Received message:`);

  const clients = await get_clients_by_user_id_paginate({
    user_id: event.data.user_id,
    min_id:  event.data.min_id,
    limit: event.data.limit,
  });

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: clients
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CLIENT_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ClientsQueueEventTypes.FETCHED_CLIENTS_BY_USER_ID_PAGINATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}


export async function ADD_CLIENT(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${ClientsQueueMessageTypes.ADD_CLIENT}] Received message:`);
  
  const client = await add_client(event.data as AddClientDto);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: client
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.CLIENT_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: ClientsQueueEventTypes.CLIENT_ADDED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}