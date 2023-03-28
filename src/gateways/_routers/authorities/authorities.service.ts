import {
  ServiceMethodAsyncResults,
  ServiceMethodResults,
  AuthorityAuthorizer,
} from "@lib/backend-shared";
import {
  ContentTypes,
  MicroservicesQueues,
  CreateAuthorityDto,
  LoginAuthorityDto,
  AuthoritiesQueueMessageTypes,
  UpdateAuthorityDto,
} from "@lib/fullstack-shared";
import { AppEnvironment } from "@lib/backend-shared";
import { rmqClient } from "../../web/web.rmq";
import { Request } from "express";






export class AuthoritiesService {

  static async check_session(request: Request): ServiceMethodAsyncResults {
    const auth = AuthorityAuthorizer(request, false);

    console.log({ auth });

    const serviceMethodResults: ServiceMethodResults = {
      status: auth.status,
      error: false,
      info: {
        message: auth.message,
        data: {
          ...auth,
        },
      }
    };
    console.log(`check session:`, { serviceMethodResults });
    return serviceMethodResults;
  }



  static get_authorities(): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.AUTHORITY_MESSAGES,
      data: {  },
      publishOptions: {
        type: AuthoritiesQueueMessageTypes.FETCH_AUTHORITIES,
        contentType: ContentTypes.JSON,
      }
    })
    .then((event) => event.data)
    .catch((event) => event.data);
  }

  static get_authority_by_id(id: number): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.AUTHORITY_MESSAGES,
      data: { id },
      publishOptions: {
        type: AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_ID,
        contentType: ContentTypes.JSON,
      }
    })
    .then((event) => event.data)
    .catch((event) => event.data);
  }

  static get_authority_by_email(email: string): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.AUTHORITY_MESSAGES,
      data: { email },
      publishOptions: {
        type: AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_EMAIL,
        contentType: ContentTypes.JSON,
      }
    })
    .then((event) => event.data as ServiceMethodResults)
    .catch((event) => event.data);
  }

  static sign_up(data: CreateAuthorityDto, request_origin: string): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.AUTHORITY_MESSAGES,
      data,
      publishOptions: {
        type: AuthoritiesQueueMessageTypes.CREATE_AUTHORITY,
        contentType: ContentTypes.JSON,
      }
    })
    .then((event) => {
      event.data.info.data = {
        authority: event.data.info.data,
        token: AppEnvironment.JWT_SECRETS.AUTHORITY.encode(event.data.info.data),
      };
      return event.data;
    })
    .catch((event) => event.data);
  }

  static sign_in(data: LoginAuthorityDto): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.AUTHORITY_MESSAGES,
      data,
      publishOptions: {
        type: AuthoritiesQueueMessageTypes.LOGIN_AUTHORITY,
        contentType: ContentTypes.JSON,
      }
    })
    .then((event) => {
      event.data.info.data = {
        authority: event.data.info.data,
        token: AppEnvironment.JWT_SECRETS.AUTHORITY.encode(event.data.info.data),
      };
      return event.data;
    })
    .catch((event) => event.data);
  }

  static update_authority(authority_id: number, updates: UpdateAuthorityDto): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.AUTHORITY_MESSAGES,
      data: { authority_id, updates },
      publishOptions: {
        type: AuthoritiesQueueMessageTypes.UPDATE_AUTHORITY,
        contentType: ContentTypes.JSON,
      }
    })
    .then((event) => {
      event.data.info.data = {
        authority: event.data.info.data,
        token: AppEnvironment.JWT_SECRETS.AUTHORITY.encode(event.data.info.data),
      };
      return event.data;
    })
    .catch((event) => event.data);
  }

  static delete_authority(authority_id: number): ServiceMethodAsyncResults {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.AUTHORITY_MESSAGES,
      data: { authority_id },
      publishOptions: {
        type: AuthoritiesQueueMessageTypes.DELETE_AUTHORITY,
        contentType: ContentTypes.JSON,
      }
    })
    .then((event) => event.data)
    .catch((event) => event.data);
  }

}
