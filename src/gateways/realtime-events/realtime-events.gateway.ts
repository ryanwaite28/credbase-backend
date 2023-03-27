/*
  Realtime Events Gateway

  Clients connect to this server for notification events
  via web socket connections, implemented with socket.io - https://www.npmjs.com/package/socket.io

  This application will connect to the message broker (rabbit mq) and listen for notification events.
  At the same time, a websocket server is also created where users and authorities can connect to.
  A map of all connected sockets by user id/authority id will be kept in memory.

  When a copy of a notification event is received from the message broker,
  it will be forwarded to the appropriate user/authority via their connected socket(s).
*/

import {
  AppEnvironment,
  RabbitMQClient
} from "@lib/backend-shared";
import {
  MicroservicesExchanges,
  MicroservicesQueues,
  NotificationsQueueEventTypes,
  RoutingKeys
} from "@lib/fullstack-shared";

import { Server as ioServer, Socket } from "socket.io";



const handleMessageTypes = [
  ...Object.values(NotificationsQueueEventTypes)
];


export const rmqClient = new RabbitMQClient({
  connection_url: AppEnvironment.RABBIT_MQ_URL,
  delayStart: 5000,
  prefetch: 5,
  retryAttempts: 3,
  retryDelay: 3000,
  autoAckUnhandledMessageTypes: true,
  queues: [
    { name: MicroservicesQueues.REALTIME_EVENTS, handleMessageTypes, options: { durable: true } },
  ],
  exchanges: [
    { name: MicroservicesExchanges.NOTIFICATION_EVENTS, type: 'fanout', options: { durable: true } },
  ],
  bindings: [
    { queue: MicroservicesQueues.REALTIME_EVENTS, exchange: MicroservicesExchanges.NOTIFICATION_EVENTS, routingKey: RoutingKeys.EVENT }
  ],

  pre_init_promises: []
});







const io = new ioServer({
  cors: { origin: AppEnvironment.SOCKETS.WHITELIST },

  allowRequest: (req, callback) => {
    console.log(`socket req origin: ${req.headers.origin}`);
    const useOrigin = (req.headers.origin || '');
    const originIsAllowed = !AppEnvironment.IS_ENV.PROD || AppEnvironment.SOCKETS.WHITELIST.includes(useOrigin);
    console.log({ originIsAllowed });
    callback(null, originIsAllowed);
  }
});


io.on('connection', (socket: Socket) => {

});
