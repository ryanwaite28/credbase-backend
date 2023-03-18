import {
  ContentTypes,
  EventMessage,
  generateJWT,
  HttpStatusCode,
  IUser,
  MicroservicesExchanges,
  RabbitMQClient,
  RoutingKeys,
  ServiceMethodResults,
  UserSignUpDto,
  UsersQueueEventTypes,
  UsersQueueMessageTypes
} from "@lib/shared";
import {
  create_user,
  get_user_by_id,
  get_user_by_email
} from "./users.repo";
import { hashSync, compareSync } from 'bcryptjs';


export async function FETCH_USER_BY_ID(event: EventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as { id: number };
  console.log(`[${UsersQueueMessageTypes.FETCH_USER_BY_ID}] Received create user message:`, { data });
  // console.log(JSON.stringify(data));

  const user = await get_user_by_id(data.id);

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
  const data = event.data as { email: string };
  console.log(`[${UsersQueueMessageTypes.FETCH_USER_BY_ID}] Received create user message:`, { data });

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
      type: UsersQueueEventTypes.USER_FETCHED_BY_EMAIL,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId
    }
  });
}


export async function CREATE_USER(event: EventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as UserSignUpDto;
  console.log(`[${UsersQueueMessageTypes.CREATE_USER}] Received create user message:`, { data });

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
        replyTo: event.message.properties.correlationId,
      }
    });
  }

  const createInfo = {
    ...data,
    password: hashSync(data.password),
  };

  const new_user: IUser = await create_user(createInfo);
  delete new_user['password'];

  const token = generateJWT(new_user);

  // create stripe customer account       stripe_customer_account_id
  // const customer = await StripeService.stripe.customers.create({
  //   name: data.displayname,
  //   description: `Avenger Customer: ${data.displayname}`,
  //   email: new_user.email,
  //   metadata: {
  //     user_id: new_user.id,
  //   }
  // });

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: {
        user: new_user,
        token
      }
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
      replyTo: event.message.properties.correlationId,
    }
  });
}