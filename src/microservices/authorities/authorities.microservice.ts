import {
  RmqEventMessage,
  RabbitMQClient,
  AppEnvironment,
  RmqHandleMessageTypeConfig,
  RmqHandleMessageTypeConfigs
} from "@lib/backend-shared";
import {
  MicroservicesExchanges,
  MicroservicesQueues,
  RoutingKeys,
  AuthoritiesQueueEventTypes,
  AuthoritiesQueueMessageTypes
} from "@lib/fullstack-shared";
import { authorities_db_init } from "./authorities.database";
import {
  CREATE_AUTHORITY,
  FETCH_AUTHORITY_BY_ID,
  FETCH_AUTHORITY_BY_EMAIL,
  UPDATE_AUTHORITY,
  LOGIN_AUTHORITY,
  FETCH_AUTHORITIES,
  DELETE_AUTHORITY,
  FETCH_AUTHORITY_BY_UUID
} from "./authorities.service";




const handleMessageTypes: RmqHandleMessageTypeConfigs = [
  { messageType: AuthoritiesQueueMessageTypes.FETCH_AUTHORITIES, callbackHandler: FETCH_AUTHORITIES },
  { messageType: AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_ID, callbackHandler: FETCH_AUTHORITY_BY_ID },
  { messageType: AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_UUID, callbackHandler: FETCH_AUTHORITY_BY_UUID },
  { messageType: AuthoritiesQueueMessageTypes.FETCH_AUTHORITY_BY_EMAIL, callbackHandler: FETCH_AUTHORITY_BY_EMAIL },
  { messageType: AuthoritiesQueueMessageTypes.LOGIN_AUTHORITY, callbackHandler: LOGIN_AUTHORITY },
  { messageType: AuthoritiesQueueMessageTypes.CREATE_AUTHORITY, callbackHandler: CREATE_AUTHORITY },
  { messageType: AuthoritiesQueueMessageTypes.UPDATE_AUTHORITY, callbackHandler: UPDATE_AUTHORITY },
  { messageType: AuthoritiesQueueMessageTypes.DELETE_AUTHORITY, callbackHandler: DELETE_AUTHORITY },
];

const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  queues: [
    { name: MicroservicesQueues.AUTHORITY_MESSAGES, handleMessageTypes, options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.AUTHORITY_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [
  ],

  pre_init_promises: [
    authorities_db_init
  ]
});

