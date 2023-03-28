import { SendEmailCommandOutput } from "@aws-sdk/client-ses";
import {
  RmqEventMessage,
  RabbitMQClient,
  ServiceMethodResults
} from "@lib/backend-shared";
import {
  IUser,
  UsersQueueEventTypes,
  IAuthority,
  AuthoritiesQueueEventTypes,
  HttpStatusCode,
  MicroservicesExchanges,
  EmailsQueueEventTypes,
  ContentTypes,
  RoutingKeys,
  EmailsQueueMessageTypes,
  IResetUserEmailsMessage,
  IResetAuthorityEmailsMessage,
  SendEmailDto
} from "@lib/fullstack-shared";
import {
  HandlebarsEmailTemplates,
  HandlebarsEmailSubjects
} from "./emails.templates";
import { sendAwsEmail } from "./ses.aws.utils";






/**
 * Send arbitrary emails via given arguments
 * 
 * @param event 
 * @param rmqClient 
 * @returns {void}
 */
export async function SEND_EMAIL(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${EmailsQueueMessageTypes.SEND_EMAIL}] Received message:`, { data: event.data });

  // const sendEmailParams = event.data as SendEmailDto;

  // const email_send_results: SendEmailCommandOutput = await sendAwsEmail({
  //   to: sendEmailParams.to_email,
  //   subject: sendEmailParams.subject,
  //   message: sendEmailParams.text,
  //   html: sendEmailParams.html,
  // });

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
  //     type: EmailsQueueEventTypes.SENT_EMAIL,
  //     contentType: ContentTypes.JSON,
  //     correlationId: event.message.properties.correlationId,
  //     replyTo: event.message.properties.replyTo,
  //   }
  // });
}



export async function USER_CREATED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${UsersQueueEventTypes.USER_CREATED}] Received message:`, { data: event.data });

  // const results = event.data as ServiceMethodResults;
  // const user = results.info.data! as IUser;

  // const name: string = `${user.firstname} ${user.lastname}`;
  // const html: string = HandlebarsEmailTemplates.USERS.welcome({ name });
  // const subject: string = HandlebarsEmailSubjects.USERS.welcome;

  // const email_send_results: SendEmailCommandOutput = await sendAwsEmail({ subject, html, to: user.email });

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
  //     correlationId: event.message.properties.correlationId,
  //     replyTo: event.message.properties.replyTo,
  //   }
  // });
}

export async function USER_DELETED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${UsersQueueEventTypes.USER_DELETED}] Received message:`, { data: event.data });

  // const results = event.data as ServiceMethodResults;
  // const user = results.info.data!.model as IUser;
  
  // const name: string = `${user.firstname} ${user.lastname}`;
  // const html: string = HandlebarsEmailTemplates.USERS.goodbye({ name });
  // const subject: string = HandlebarsEmailSubjects.USERS.goodbye;

  // const email_send_results: SendEmailCommandOutput = await sendAwsEmail({ subject, html, to: user.email });

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
  //     correlationId: event.message.properties.correlationId,
  //     replyTo: event.message.properties.replyTo,
  //   }
  // });
}



export async function AUTHORITY_CREATED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AuthoritiesQueueEventTypes.AUTHORITY_CREATED}] Received message:`, { data: event.data });

  // const results = event.data as ServiceMethodResults;
  // const authority = results.info.data! as IAuthority;
  
  // const html: string = HandlebarsEmailTemplates.AUTHORITIES.welcome({ name: authority.name });
  // const subject: string = HandlebarsEmailSubjects.AUTHORITIES.welcome;

  // const email_send_results: SendEmailCommandOutput = await sendAwsEmail({ subject, html, to: authority.email });

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
  //     correlationId: event.message.properties.correlationId,
  //     replyTo: event.message.properties.replyTo,
  //   }
  // });
}

export async function AUTHORITY_DELETED(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${AuthoritiesQueueEventTypes.AUTHORITY_DELETED}] Received message:`, { data: event.data });
  
  // const results = event.data as ServiceMethodResults;
  // const authority = results.info.data! as IAuthority;
  
  // const html: string = HandlebarsEmailTemplates.AUTHORITIES.goodbye({ name: authority.name });
  // const subject: string = HandlebarsEmailSubjects.AUTHORITIES.goodbye;

  // const email_send_results: SendEmailCommandOutput = await sendAwsEmail({ subject, html, to: authority.email });

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
  //     correlationId: event.message.properties.correlationId,
  //     replyTo: event.message.properties.replyTo,
  //   }
  // });
}




export async function RESET_USER_PASSWORD(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${EmailsQueueMessageTypes.RESET_USER_PASSWORD}] Received message:`, { data: event.data });
  
  // const data = event.data as IResetUserEmailsMessage;
  // const { reset_password_url, user_email } = data;
  
  // const html: string = HandlebarsEmailTemplates.AUTHORITIES.password_reset({ reset_password_url });
  // const subject: string = HandlebarsEmailSubjects.AUTHORITIES.password_reset;

  // const email_send_results: SendEmailCommandOutput = await sendAwsEmail({ subject, html, to: user_email });

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
  //     type: EmailsQueueEventTypes.RESETTED_USER_PASSWORD,
  //     contentType: ContentTypes.JSON,
  //     correlationId: event.message.properties.correlationId,
  //     replyTo: event.message.properties.replyTo,
  //   }
  // });
}

export async function RESET_AUTHORITY_PASSWORD(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${EmailsQueueMessageTypes.RESET_AUTHORITY_PASSWORD}] Received message:`, { data: event.data });
  
  // const data = event.data as IResetAuthorityEmailsMessage;
  // const { reset_password_url, authority_email } = data;
  
  // const html: string = HandlebarsEmailTemplates.AUTHORITIES.password_reset({ reset_password_url });
  // const subject: string = HandlebarsEmailSubjects.AUTHORITIES.password_reset;

  // const email_send_results: SendEmailCommandOutput = await sendAwsEmail({ subject, html, to: authority_email });

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
  //     type: EmailsQueueEventTypes.RESETTED_AUTHORITY_PASSWORD,
  //     contentType: ContentTypes.JSON,
  //     correlationId: event.message.properties.correlationId,
  //     replyTo: event.message.properties.replyTo,
  //   }
  // });
}