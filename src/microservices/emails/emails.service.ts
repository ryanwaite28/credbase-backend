import {
  EventMessage,
  RabbitMQClient,
  ServiceMethodResults,
  UsersQueueEventTypes
} from "@lib/shared";




export async function USER_CREATED(event: EventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as ServiceMethodResults;
  console.log(`[${UsersQueueEventTypes.USER_CREATED}] Received message:`, { data });
  rmqClient.ack(event.message);
}

export async function USERS_FETCHED(event: EventMessage, rmqClient: RabbitMQClient) {
  const data = event.data as ServiceMethodResults;
  console.log(`[${UsersQueueEventTypes.USERS_FETCHED}] Received message:`, { data });
  rmqClient.ack(event.message);
}