import {
  ContentTypes,
  MicroservicesQueues,
  ServiceMethodAsyncResults,
  ServiceMethodResults,
  UserSignUpDto,
  UserSignInDto,
  UsersQueueMessageTypes
} from "@lib/shared";
import { rmqClient } from "./users.rmq";






export class UsersService {

  static get_users(): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data: {  },
      publishOptions: {
        type: UsersQueueMessageTypes.FETCH_USERS,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS
      }
    })
    .then((event) => event.data as ServiceMethodResults);
  }

  static get_user_by_id(id: number): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data: { id },
      publishOptions: {
        type: UsersQueueMessageTypes.FETCH_USER_BY_ID,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS
      }
    })
    .then((event) => event.data as ServiceMethodResults);
  }

  static sign_up(data: UserSignUpDto, request_origin: string): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data,
      publishOptions: {
        type: UsersQueueMessageTypes.CREATE_USER,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS
      }
    })
    .then((event) => event.data as ServiceMethodResults);
  }

  static sign_in(data: UserSignInDto): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data,
      publishOptions: {
        type: UsersQueueMessageTypes.LOGIN_USER,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS
      }
    })
    .then((event) => event.data as ServiceMethodResults);
  }

}
