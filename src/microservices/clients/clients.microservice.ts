import { RmqEventMessage, RabbitMQClient, AppEnvironment } from "@lib/backend-shared";
import {
  MicroservicesQueues,
  ClientsQueueMessageTypes,
  MicroservicesExchanges,
} from "@lib/fullstack-shared";
import { clients_db_init } from "./clients.database";
import {
  FETCH_CLIENT_BY_ID,
  FETCH_CLIENTS_BY_AUTHORITY_ID,
  FETCH_CLIENTS_BY_AUTHORITY_ID_PAGINATE,
  ADD_CLIENT,
  FETCH_CLIENT_BY_UUID,
  FETCH_CLIENTS_BY_USER_ID,
  FETCH_CLIENTS_BY_USER_ID_PAGINATE,
  ACCEPT_CLIENT_REQUEST,
  ADD_CLIENT_REQUEST,
  CANCEL_CLIENT_REQUEST,
  CHECK_CLIENT_REQUEST,
  CHECK_PENDING_CLIENT_REQUEST,
  DECLINE_CLIENT_REQUEST,
} from "./clients.service";




const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.CLIENT_MESSAGES, handleMessageTypes: Object.values(ClientsQueueMessageTypes), options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.CLIENT_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [],

  pre_init_promises: [
    clients_db_init
  ]
});



const clientsQueue = rmqClient.onQueue(MicroservicesQueues.CLIENT_MESSAGES);



clientsQueue.handle(ClientsQueueMessageTypes.FETCH_CLIENT_BY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_CLIENT_BY_ID(event, rmqClient)
});

clientsQueue.handle(ClientsQueueMessageTypes.FETCH_CLIENT_BY_UUID).subscribe({
  next: (event: RmqEventMessage) => FETCH_CLIENT_BY_UUID(event, rmqClient)
});

clientsQueue.handle(ClientsQueueMessageTypes.FETCH_CLIENTS_BY_AUTHORITY_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_CLIENTS_BY_AUTHORITY_ID(event, rmqClient)
});

clientsQueue.handle(ClientsQueueMessageTypes.FETCH_CLIENTS_BY_AUTHORITY_ID_PAGINATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_CLIENTS_BY_AUTHORITY_ID_PAGINATE(event, rmqClient)
});

clientsQueue.handle(ClientsQueueMessageTypes.FETCH_CLIENTS_BY_USER_ID).subscribe({
  next: (event: RmqEventMessage) => FETCH_CLIENTS_BY_USER_ID(event, rmqClient)
});

clientsQueue.handle(ClientsQueueMessageTypes.FETCH_CLIENTS_BY_USER_ID_PAGINATE).subscribe({
  next: (event: RmqEventMessage) => FETCH_CLIENTS_BY_USER_ID_PAGINATE(event, rmqClient)
});



clientsQueue.handle(ClientsQueueMessageTypes.ADD_CLIENT).subscribe({
  next: (event: RmqEventMessage) => ADD_CLIENT(event, rmqClient)
});




clientsQueue.handle(ClientsQueueMessageTypes.ADD_CLIENT_REQUEST).subscribe({
  next: (event: RmqEventMessage) => ADD_CLIENT_REQUEST(event, rmqClient)
});


clientsQueue.handle(ClientsQueueMessageTypes.CHECK_CLIENT_REQUEST).subscribe({
  next: (event: RmqEventMessage) => CHECK_CLIENT_REQUEST(event, rmqClient)
});


clientsQueue.handle(ClientsQueueMessageTypes.CHECK_PENDING_CLIENT_REQUEST).subscribe({
  next: (event: RmqEventMessage) => CHECK_PENDING_CLIENT_REQUEST(event, rmqClient)
});


clientsQueue.handle(ClientsQueueMessageTypes.CANCEL_CLIENT_REQUEST).subscribe({
  next: (event: RmqEventMessage) => CANCEL_CLIENT_REQUEST(event, rmqClient)
});


clientsQueue.handle(ClientsQueueMessageTypes.ACCEPT_CLIENT_REQUEST).subscribe({
  next: (event: RmqEventMessage) => ACCEPT_CLIENT_REQUEST(event, rmqClient)
});


clientsQueue.handle(ClientsQueueMessageTypes.DECLINE_CLIENT_REQUEST).subscribe({
  next: (event: RmqEventMessage) => DECLINE_CLIENT_REQUEST(event, rmqClient)
});
