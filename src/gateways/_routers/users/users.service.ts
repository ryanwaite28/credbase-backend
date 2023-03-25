
import { ServiceMethodAsyncResults, ServiceMethodResults } from "@lib/backend-shared";
import { ContentTypes, MicroservicesQueues, UserSignInDto, UserSignUpDto, UsersQueueEventTypes, UsersQueueMessageTypes, UserUpdatesDto } from "@lib/fullstack-shared";
import { AppEnvironment } from "@lib/backend-shared";
import { rmqClient } from "../../web/web.rmq";






export class UsersService {

  static get_users(): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data: {  },
      publishOptions: {
        type: UsersQueueMessageTypes.FETCH_USERS,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS,
      }
    })
    .then((event) => event.data)
    .catch((event) => event.data);
  }

  static get_user_by_id(id: number): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data: { id },
      publishOptions: {
        type: UsersQueueMessageTypes.FETCH_USER_BY_ID,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS,
      }
    })
    .then((event) => event.data)
    .catch((event) => event.data);
  }

  static get_user_by_email(email: string): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data: { email },
      publishOptions: {
        type: UsersQueueMessageTypes.FETCH_USER_BY_EMAIL,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS,
      }
    })
    .then((event) => event.data as ServiceMethodResults)
    .catch((event) => event.data);
  }

  static sign_up(data: UserSignUpDto, request_origin: string): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data,
      publishOptions: {
        type: UsersQueueMessageTypes.CREATE_USER,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS,
      }
    })
    .then((event) => {
      event.data.info.data = {
        user: event.data.info.data,
        token: AppEnvironment.JWT_SECRETS.USER.encode(event.data.info.data),
      };

      // send welcome email
      rmqClient.sendMessage({
        queue: MicroservicesQueues.EMAILS,
        data: event.data,
        publishOptions: {
          type: UsersQueueEventTypes.USER_CREATED,
          contentType: ContentTypes.JSON,
          correlationId: Date.now().toString(),
        }
      });

      return event.data;
    })
    .catch((event) => event.data);
  }

  static sign_in(data: UserSignInDto): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data,
      publishOptions: {
        type: UsersQueueMessageTypes.LOGIN_USER,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS,
      }
    })
    .then((event) => {
      event.data.info.data = {
        user: event.data.info.data,
        token: AppEnvironment.JWT_SECRETS.USER.encode(event.data.info.data),
      };
      return event.data;
    })
    .catch((event) => event.data);
  }

  static update_user(user_id: number, updates: UserUpdatesDto): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data: { user_id, updates },
      publishOptions: {
        type: UsersQueueMessageTypes.UPDATE_USER,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS,
      }
    })
    .then((event) => {
      event.data.info.data = {
        user: event.data.info.data,
        token: AppEnvironment.JWT_SECRETS.USER.encode(event.data.info.data),
      };
      return event.data;
    })
    .catch((event) => event.data);
  }

  static delete_user(user_id: number): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.USER_MESSAGES,
      data: { user_id },
      publishOptions: {
        type: UsersQueueMessageTypes.DELETE_USER,
        contentType: ContentTypes.JSON,
        correlationId: Date.now().toString(),
        replyTo: MicroservicesQueues.USER_EVENTS,
      }
    })
    .then((event) => {
      // send welcome email
      rmqClient.sendMessage({
        queue: MicroservicesQueues.EMAILS,
        data: event.data,
        publishOptions: {
          type: UsersQueueEventTypes.USER_DELETED,
          contentType: ContentTypes.JSON,
          correlationId: Date.now().toString(),
        }
      });

      return event.data;
    })
    .catch((event) => event.data);
  }

}
