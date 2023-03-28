import {
  RmqEventMessage,
  RabbitMQClient,
  ServiceMethodResults,
  ServiceMethodResultsInfo
} from "@lib/backend-shared";
import {
  MicroservicesExchanges,
  RoutingKeys,
  ContentTypes,
  HttpStatusCode,
  NotificationsQueueMessageTypes,
  NotificationsQueueEventTypes,
  CreateUserNotificationDto,
  CreateAuthorityNotificationDto,
  ItemsQueueEventTypes,
  IItem,
  Models
} from "@lib/fullstack-shared";
import {
  create_authority_notification,
  create_user_notification,
  get_authority_notifications,
  get_authority_notifications_last_opened,
  get_authority_notifications_paginate,
  get_user_notifications,
  get_user_notifications_last_opened,
  get_user_notifications_paginate
} from "./notifications.repo";



export async function FETCH_USER_NOTIFICATIONS_LAST_OPENED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${NotificationsQueueMessageTypes.FETCH_USER_NOTIFICATIONS_LAST_OPENED}] Received message:`);

  const data = await get_user_notifications_last_opened(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.NOTIFICATION_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: NotificationsQueueEventTypes.FETCHED_USER_NOTIFICATIONS_LAST_OPENED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_USER_NOTIFICATIONS(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${NotificationsQueueMessageTypes.FETCH_USER_NOTIFICATIONS}] Received message:`);

  const data = await get_user_notifications(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.NOTIFICATION_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: NotificationsQueueEventTypes.FETCHED_USER_NOTIFICATIONS,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_USER_NOTIFICATIONS_PAGINATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${NotificationsQueueMessageTypes.FETCH_USER_NOTIFICATIONS_PAGINATE}] Received message:`);

  const data = await get_user_notifications_paginate({
    for_user_id: event.data.for_user_id,
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
    exchange: MicroservicesExchanges.NOTIFICATION_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: NotificationsQueueEventTypes.FETCHED_USER_NOTIFICATIONS_PAGINATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function CREATE_USER_NOTIFICATION(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${NotificationsQueueMessageTypes.CREATE_USER_NOTIFICATION}] Received message:`);

  const data = await create_user_notification(event.data as CreateUserNotificationDto);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.NOTIFICATION_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: NotificationsQueueEventTypes.CREATED_USER_NOTIFICATION,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}



export async function FETCH_AUTHORITY_NOTIFICATIONS_LAST_OPENED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${NotificationsQueueMessageTypes.FETCH_AUTHORITY_NOTIFICATIONS_LAST_OPENED}] Received message:`);

  const data = await get_authority_notifications_last_opened(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.NOTIFICATION_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: NotificationsQueueEventTypes.FETCHED_AUTHORITY_NOTIFICATIONS_LAST_OPENED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_AUTHORITY_NOTIFICATIONS(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${NotificationsQueueMessageTypes.FETCH_AUTHORITY_NOTIFICATIONS}] Received message:`);

  const data = await get_authority_notifications(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.NOTIFICATION_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: NotificationsQueueEventTypes.FETCHED_AUTHORITY_NOTIFICATIONS,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_AUTHORITY_NOTIFICATIONS_PAGINATE(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${NotificationsQueueMessageTypes.FETCH_AUTHORITY_NOTIFICATIONS_PAGINATE}] Received message:`);

  const data = await get_authority_notifications_paginate({
    for_authority_id: event.data.for_authority_id,
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
    exchange: MicroservicesExchanges.NOTIFICATION_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: NotificationsQueueEventTypes.FETCHED_AUTHORITY_NOTIFICATIONS_PAGINATE,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function CREATE_AUTHORITY_NOTIFICATION(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${NotificationsQueueMessageTypes.CREATE_AUTHORITY_NOTIFICATION}] Received message:`);

  const data = await create_authority_notification(event.data as CreateAuthorityNotificationDto);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.NOTIFICATION_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: NotificationsQueueEventTypes.CREATED_AUTHORITY_NOTIFICATION,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}
