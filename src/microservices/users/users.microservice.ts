
import {
  RabbitMQClient,
  AppEnvironment,
  RmqHandleMessageTypeConfigs
} from "@lib/backend-shared";
import {
  MicroservicesQueues,
  UsersQueueMessageTypes,
  MicroservicesExchanges,
} from "@lib/fullstack-shared";
import {
  CREATE_USER,
  FETCH_USER_BY_ID,
  FETCH_USER_BY_EMAIL,
  UPDATE_USER,
  LOGIN_USER,
  FETCH_USERS,
  DELETE_USER,
  FETCH_USER_BY_UUID
} from "./users.service";
import { users_db_init } from "./users.database";




const handleMessageTypes: RmqHandleMessageTypeConfigs = [
  { messageType: UsersQueueMessageTypes.FETCH_USERS, callbackHandler: FETCH_USERS },
  { messageType: UsersQueueMessageTypes.FETCH_USER_BY_ID, callbackHandler: FETCH_USER_BY_ID },
  { messageType: UsersQueueMessageTypes.FETCH_USER_BY_UUID, callbackHandler: FETCH_USER_BY_UUID },
  { messageType: UsersQueueMessageTypes.FETCH_USER_BY_EMAIL, callbackHandler: FETCH_USER_BY_EMAIL },
  { messageType: UsersQueueMessageTypes.LOGIN_USER, callbackHandler: LOGIN_USER },
  { messageType: UsersQueueMessageTypes.CREATE_USER, callbackHandler: CREATE_USER },
  { messageType: UsersQueueMessageTypes.UPDATE_USER, callbackHandler: UPDATE_USER },
  { messageType: UsersQueueMessageTypes.DELETE_USER, callbackHandler: DELETE_USER },
];

const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  // autoAckUnhandledMessageTypes: true,

  queues: [
    { name: MicroservicesQueues.USER_MESSAGES, handleMessageTypes, options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.USER_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [],

  pre_init_promises: [
    users_db_init
  ]
});
