import {
  create_user,
  get_user_by_id,
  get_user_by_email,
  update_user,
  get_users,
  get_user_password_by_email,
  delete_user
} from "./users.repo";
import {
  hashSync,
  compareSync
} from 'bcryptjs';
import {
  EventMessage,
  RabbitMQClient,
  ServiceMethodResults
} from "@lib/backend-shared";
import {
  UsersQueueMessageTypes,
  MicroservicesExchanges,
  RoutingKeys,
  UsersQueueEventTypes,
  ContentTypes,
  UserSignUpDto,
  IUser,
  UserUpdatesDto,
  UserSignInDto,
  HttpStatusCode
} from "@lib/fullstack-shared";



export async function FETCH_USERS(event: EventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${UsersQueueMessageTypes.FETCH_USERS}] Received fetch users message:`);

  const users = await get_users();

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: users
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.USER_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: UsersQueueEventTypes.USERS_FETCHED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}

export async function FETCH_USER_BY_ID(event: EventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${UsersQueueMessageTypes.FETCH_USER_BY_ID}] Received message:`, { data: event.data });

  const user = await get_user_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: user
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.USER_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: UsersQueueEventTypes.USER_FETCHED_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}

export async function FETCH_USER_BY_EMAIL(event: EventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${UsersQueueMessageTypes.FETCH_USER_BY_EMAIL}] Received message:`, { data: event.data });

  const user = await get_user_by_email(event.data.email);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: user
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.USER_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: UsersQueueEventTypes.USER_FETCHED_BY_EMAIL,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}


export async function CREATE_USER(event: EventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as UserSignUpDto;
  console.log(`[${UsersQueueMessageTypes.CREATE_USER}] Received message:`, { data });

  const check_email = await get_user_by_email(data.email);
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
      exchange: MicroservicesExchanges.USER_EVENTS,
      routingKey: RoutingKeys.EVENT,
      data: serviceMethodResults,
      publishOptions: {
        type: UsersQueueEventTypes.USER_CREATE_EXCEPTION,
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

  const new_user: IUser = await create_user(createInfo);
  delete new_user['password'];

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: new_user
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.USER_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: UsersQueueEventTypes.USER_CREATED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.correlationId,
    }
  });
}

export async function UPDATE_USER(event: EventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as { user_id: number, updates: UserUpdatesDto };
  console.log(`[${UsersQueueMessageTypes.UPDATE_USER}] Received message:`);

  const user = await update_user(data.user_id, data.updates);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: user
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.USER_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: UsersQueueEventTypes.USER_UPDATED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function DELETE_USER(event: EventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as { user_id: number };
  console.log(`[${UsersQueueMessageTypes.DELETE_USER}] Received message:`);

  const results = await delete_user(data.user_id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: results
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.USER_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: UsersQueueEventTypes.USER_DELETED,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.replyTo,
    }
  });
}

export async function LOGIN_USER(event: EventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as UserSignInDto;
  console.log(`[${UsersQueueMessageTypes.LOGIN_USER}] Received message:`, { data });

  const check_email = await get_user_password_by_email(data.email);
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
      exchange: MicroservicesExchanges.USER_EVENTS,
      routingKey: RoutingKeys.EVENT,
      data: serviceMethodResults,
      publishOptions: {
        type: UsersQueueEventTypes.USER_LOGIN_EXCEPTION,
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
      exchange: MicroservicesExchanges.USER_EVENTS,
      routingKey: RoutingKeys.EVENT,
      data: serviceMethodResults,
      publishOptions: {
        type: UsersQueueEventTypes.USER_LOGIN_EXCEPTION,
        contentType: ContentTypes.JSON,
        correlationId: event.message.properties.correlationId,
      }
    });
  }
  
  const user = await get_user_by_email(data.email);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: user
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.USER_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: UsersQueueEventTypes.USER_LOGGED_IN,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      // replyTo: event.message.properties.correlationId,
    }
  });
}