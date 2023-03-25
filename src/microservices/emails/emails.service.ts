import { RmqEventMessage, RabbitMQClient, ServiceMethodResults } from "@lib/backend-shared";
import { IUser, UsersQueueEventTypes, IAuthority, AuthoritiesQueueEventTypes } from "@lib/fullstack-shared";
import {
  HandlebarsEmailTemplates,
  HandlebarsEmailSubjects
} from "./emails.templates";
import { sendAwsEmail } from "./ses.aws.utils";




export async function USER_CREATED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${UsersQueueEventTypes.USER_CREATED}] Received message:`, { data: event.data });

  const results = event.data as ServiceMethodResults;
  const user = results.info.data! as IUser;
  
  // send welcome email

  // const name = `${user.firstname} ${user.lastname}`;
  // const html_email = HandlebarsEmailTemplates.USERS.welcome({ name });
  // const email_send_results = await sendAwsEmail({
  //   to: user.email,
  //   subject: HandlebarsEmailSubjects.USERS.welcome,
  //   html: html_email
  // });
  // console.log(email_send_results);


  // const serviceMethodResults: ServiceMethodResults = {
  //   status: HttpStatusCode.OK,
  //   error: false,
  //   info: {
  //     data: email_send_results
  //   }
  // };
  
  rmqClient.ack(event.message);
  // return rmqClient.publishEvent({
  //   exchange: MicroservicesExchanges.EMAIL_EVENTS,
  //   routingKey: RoutingKeys.EVENT,
  //   data: serviceMethodResults,
  //   publishOptions: {
  //     type: EmailsQueueEventTypes.USER_WELCOME_EMAIL_SENT,
  //     contentType: ContentTypes.JSON,
  //     correlationId: event.message.properties.correlationId
  //   }
  // });
}

export async function USER_DELETED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${UsersQueueEventTypes.USER_DELETED}] Received message:`, { data: event.data });

  const results = event.data as ServiceMethodResults;
  const user = results.info.data! as IUser;
  
  // send goodbye email

  // const name = `${user.firstname} ${user.lastname}`;
  // const html_email = HandlebarsEmailTemplates.USERS.goodbye({ name });
  // const email_send_results = await sendAwsEmail({
  //   to: user.email,
  //   subject:  HandlebarsEmailSubjects.USERS.goodbye,
  //   html: html_email
  // });
  // console.log(email_send_results);

  // const serviceMethodResults: ServiceMethodResults = {
  //   status: HttpStatusCode.OK,
  //   error: false,
  //   info: {
  //     data: email_send_results
  //   }
  // };
  
  rmqClient.ack(event.message);
  // return rmqClient.publishEvent({
  //   exchange: MicroservicesExchanges.EMAIL_EVENTS,
  //   routingKey: RoutingKeys.EVENT,
  //   data: serviceMethodResults,
  //   publishOptions: {
  //     type: EmailsQueueEventTypes.USER_GOODBYE_EMAIL_SENT,
  //     contentType: ContentTypes.JSON,
  //     correlationId: event.message.properties.correlationId
  //   }
  // });
}



export async function AUTHORITY_CREATED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AuthoritiesQueueEventTypes.AUTHORITY_CREATED}] Received message:`, { data: event.data });

  const results = event.data as ServiceMethodResults;
  const authority = results.info.data! as IAuthority;
  
  // send welcome email

  // const html_email = HandlebarsEmailTemplates.AUTHORITIES.welcome({ name: authority.name });
  // const email_send_results = await sendAwsEmail({
  //   to: authority.email,
  //   subject:  HandlebarsEmailSubjects.AUTHORITIES.welcome,
  //   html: html_email
  // });
  // console.log(email_send_results);

  // const serviceMethodResults: ServiceMethodResults = {
  //   status: HttpStatusCode.OK,
  //   error: false,
  //   info: {
  //     data: email_send_results
  //   }
  // };
  
  rmqClient.ack(event.message);
  // return rmqClient.publishEvent({
  //   exchange: MicroservicesExchanges.EMAIL_EVENTS,
  //   routingKey: RoutingKeys.EVENT,
  //   data: serviceMethodResults,
  //   publishOptions: {
  //     type: EmailsQueueEventTypes.AUTHORITY_WELCOME_EMAIL_SENT,
  //     contentType: ContentTypes.JSON,
  //     correlationId: event.message.properties.correlationId
  //   }
  // });
}

export async function AUTHORITY_DELETED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AuthoritiesQueueEventTypes.AUTHORITY_DELETED}] Received message:`, { data: event.data });
  
  const results = event.data as ServiceMethodResults;
  const authority = results.info.data! as IAuthority;
  
  // send goodbye email

  // const html_email = HandlebarsEmailTemplates.AUTHORITIES.goodbye({ name: authority.name });
  // const email_send_results = await sendAwsEmail({
  //   to: authority.email,
  //   subject:  HandlebarsEmailSubjects.AUTHORITIES.goodbye,
  //   html: html_email
  // });
  // console.log(email_send_results);

  // const serviceMethodResults: ServiceMethodResults = {
  //   status: HttpStatusCode.OK,
  //   error: false,
  //   info: {
  //     data: email_send_results
  //   }
  // };
  
  rmqClient.ack(event.message);
  // return rmqClient.publishEvent({
  //   exchange: MicroservicesExchanges.EMAIL_EVENTS,
  //   routingKey: RoutingKeys.EVENT,
  //   data: serviceMethodResults,
  //   publishOptions: {
  //     type: EmailsQueueEventTypes.AUTHORITY_GOODBYE_EMAIL_SENT,
  //     contentType: ContentTypes.JSON,
  //     correlationId: event.message.properties.correlationId
  //   }
  // });
}