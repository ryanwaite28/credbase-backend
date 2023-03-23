import {
  RmqEventMessage,
  RabbitMQClient,
  ServiceMethodResults
} from "@lib/backend-shared";
import {
  create_authority,
  get_authority_by_id,
  get_authority_by_email,
  update_authority,
  get_authorities,
  get_authority_password_by_email,
  delete_authority,
  get_authority_by_uuid
} from "./authorities.repo";
import {
  hashSync,
  compareSync
} from 'bcryptjs';
import {
  AuthoritiesQueueEventTypes,
  AuthoritiesQueueMessageTypes,
  ContentTypes,
  CreateAuthorityDto,
  HttpStatusCode,
  IAuthority,
  LoginAuthorityDto,
  MicroservicesExchanges,
  RoutingKeys,
  UpdateAuthorityDto
} from "@lib/fullstack-shared";



export async function FETCH_AUTHORITIES(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AuthoritiesQueueMessageTypes.FETCH_AUTHORITIES}] Received fetch authorities message:`);

  const authorities = await get_authorities();

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: authorities
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AuthoritiesQueueEventTypes.AUTHORITIES_FETCHED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}

export async function FETCH_AUTHORITY_BY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_ID}] Received message:`, { data: event.data });

  const authority = await get_authority_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: authority
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AuthoritiesQueueEventTypes.AUTHORITY_FETCHED_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}

export async function FETCH_AUTHORITY_BY_UUID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_UUID}] Received message:`, { data: event.data });

  const authority = await get_authority_by_uuid(event.data.uuid);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: authority
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AuthoritiesQueueEventTypes.AUTHORITY_FETCHED_BY_UUID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}

export async function FETCH_AUTHORITY_BY_EMAIL(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_EMAIL}] Received message:`, { data: event.data });

  const authority = await get_authority_by_email(event.data.email);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: authority
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AuthoritiesQueueEventTypes.AUTHORITY_FETCHED_BY_EMAIL,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}


export async function CREATE_AUTHORITY(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as CreateAuthorityDto;
  console.log(`[${AuthoritiesQueueMessageTypes.CREATE_AUTHORITY}] Received message:`, { data });

  const check_email = await get_authority_by_email(data.email);
  if (check_email) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: `Email already in use.`,
        data: {
          email: data.email
        }
      }
    };

    rmqClient.ack(event.message);
    return rmqClient.publishEvent({
      exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
      routingKey: RoutingKeys.EVENT,
      data: serviceMethodResults,
      publishOptions: {
        type: AuthoritiesQueueEventTypes.AUTHORITY_CREATE_EXCEPTION,
        contentType: ContentTypes.JSON,
        correlationId: event.message.properties.correlationId,
        // replyTo: event.message.properties.replyTo,
      }
    });
  }

  const createInfo = {
    ...data,
    password: hashSync(data.password),
  };

  const new_authority: IAuthority = await create_authority(createInfo);
  delete new_authority['password'];

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: new_authority
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AuthoritiesQueueEventTypes.AUTHORITY_CREATED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.correlationId,
    }
  });
}

export async function UPDATE_AUTHORITY(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as { authority_id: number, updates: UpdateAuthorityDto };
  console.log(`[${AuthoritiesQueueMessageTypes.UPDATE_AUTHORITY}] Received message:`);

  const authority = await update_authority(data.authority_id, data.updates);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: authority
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AuthoritiesQueueEventTypes.AUTHORITY_UPDATED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function DELETE_AUTHORITY(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as { authority_id: number };
  console.log(`[${AuthoritiesQueueMessageTypes.DELETE_AUTHORITY}] Received message:`);

  const results = await delete_authority(data.authority_id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: results
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AuthoritiesQueueEventTypes.AUTHORITY_DELETED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function LOGIN_AUTHORITY(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as LoginAuthorityDto;
  console.log(`[${AuthoritiesQueueMessageTypes.LOGIN_AUTHORITY}] Received message:`, { data });

  const check_email = await get_authority_password_by_email(data.email);
  if (!check_email) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: `Invalid credentials.`,
        data: {
          email: data.email
        }
      }
    };

    rmqClient.ack(event.message);
    return rmqClient.publishEvent({
      exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
      routingKey: RoutingKeys.EVENT,
      data: serviceMethodResults,
      publishOptions: {
        type: AuthoritiesQueueEventTypes.AUTHORITY_LOGIN_EXCEPTION,
        contentType: ContentTypes.JSON,
        correlationId: event.message.properties.correlationId,
      }
    });
  }

  const passwordsValid = compareSync(data.password!, check_email.password!);
  if (!passwordsValid) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: `Invalid credentials.`,
        data: {
          email: data.email
        }
      }
    };

    rmqClient.ack(event.message);
    return rmqClient.publishEvent({
      exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
      routingKey: RoutingKeys.EVENT,
      data: serviceMethodResults,
      publishOptions: {
        type: AuthoritiesQueueEventTypes.AUTHORITY_LOGIN_EXCEPTION,
        contentType: ContentTypes.JSON,
        correlationId: event.message.properties.correlationId,
      }
    });
  }
  
  const authority = await get_authority_by_email(data.email);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: authority
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.AUTHORITY_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: AuthoritiesQueueEventTypes.AUTHORITY_LOGGED_IN,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.correlationId,
    }
  });
}