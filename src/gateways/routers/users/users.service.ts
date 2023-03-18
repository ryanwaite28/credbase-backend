import {
  ContentTypes,
  EventMessage,
  HttpStatusCode,
  MicroservicesQueues,
  ServiceMethodAsyncResults,
  ServiceMethodResults,
  UserSignUpDto,
  UsersQueueMessageTypes
} from "@lib/shared";
import { rmqClient } from "./users.rmq";






export class UsersService {

  /** Request Handlers */

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
    .then((event) => event.data as ServiceMethodAsyncResults);
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
    .then((event) => event.data as ServiceMethodAsyncResults);
  }

}
