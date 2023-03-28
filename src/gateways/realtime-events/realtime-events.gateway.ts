/*
  Realtime Events Gateway

  Clients connect to this server for realtime notification events
  via web socket connections, implemented with socket.io - https://www.npmjs.com/package/socket.io

  This application will connect to the message broker (rabbit mq) and listen for notification events.
  At the same time, a websocket server is also created where users and authorities can connect to.
  A unique room will exist for sockets, grouped by the user's/authority's ID.

  When a notification event is received from the message broker,
  it will be forwarded to the appropriate user/authority via their connected socket(s)
  by the id found in the notification event body.
*/



import {
  AppEnvironment,
  RabbitMQClient,
  RmqEventMessage,
  ServiceMethodResults
} from "@lib/backend-shared";
import {
  IAuthority,
  IAuthorityNotification,
  IUser,
  IUserNotification,
  MicroservicesExchanges,
  MicroservicesQueues,
  NotificationsQueueEventTypes,
  RealtimeIoEvents,
  RealtimeSocketEvents,
  RoutingKeys
} from "@lib/fullstack-shared";

import {
  Server,
  Socket,
} from "socket.io";






/** ----- Web Socket IO Server ----- **/



// Socket handlers

async function USER_SOCKET_TRACK(
  io: Server,
  socket: Socket,
  data: any
) {
  const validJwtInData = (
    data.hasOwnProperty('jwt') &&
    typeof(data.jwt) === 'string' &&
    !!data.jwt
  );
  console.log({ socket: socket.id, data, validJwtInData });
  if (!validJwtInData) {
    io.to(socket.id).emit(`${RealtimeSocketEvents.SOCKET_TRACK_ERROR}`, { message: `jwt is required.` });
    return;
  }

  console.log(`${RealtimeSocketEvents.USER_SOCKET_TRACK} event`);

  /* Check token validity */
  const token = data.jwt;
  let you: IUser;
  try {
    you = (AppEnvironment.JWT_SECRETS.USER.decode(token) || null) as IUser;
  } 
  catch (e) {
    console.log(e);
    io.to(socket.id).emit(`${RealtimeSocketEvents.SOCKET_TRACK_ERROR}`, { message: `jwt is invalid.`, e });
    return;
  }

  if (!you) {
    io.to(socket.id).emit(`${RealtimeSocketEvents.SOCKET_TRACK_ERROR}`, { message: `jwt is invalid.` });
    return;
  }

  const ID: number = you.id;


  // add user to it's dedicated room
  const usersSocketsRoom = `${RealtimeSocketEvents.FOR_USER}:${ID}`;
  socket.join(usersSocketsRoom);
  io.in(usersSocketsRoom).fetchSockets().then((sockets) => {
    console.log(`${RealtimeSocketEvents.USER_SOCKET_TRACK} - User ${ID} added socket id ${socket.id} to room ${usersSocketsRoom} | sockets in room:`, sockets);
  });
}

async function AUTHORITY_SOCKET_TRACK(
  io: Server,
  socket: Socket,
  data: any
) {
  const validJwtInData = (
    data.hasOwnProperty('jwt') &&
    typeof(data.jwt) === 'string' &&
    !!data.jwt
  );
  console.log({ socket: socket.id, data, validJwtInData });
  if (!validJwtInData) {
    io.to(socket.id).emit(`${RealtimeSocketEvents.SOCKET_TRACK_ERROR}`, { message: `jwt is required.` });
    return;
  }

  console.log(`${RealtimeSocketEvents.AUTHORITY_SOCKET_TRACK} event`);

  /* Check token validity */
  const token = data.jwt;
  let you: IAuthority;
  try {
    you = (AppEnvironment.JWT_SECRETS.AUTHORITY.decode(token) || null) as IAuthority;
  } 
  catch (e) {
    console.log(e);
    io.to(socket.id).emit(`${RealtimeSocketEvents.SOCKET_TRACK_ERROR}`, { message: `jwt is invalid.`, e });
    return;
  }

  if (!you) {
    io.to(socket.id).emit(`${RealtimeSocketEvents.SOCKET_TRACK_ERROR}`, { message: `jwt is invalid.` });
    return;
  }

  const ID: number = you.id;


  // add authority to it's dedicated room
  const authoritiesSocketsRoom = `${RealtimeSocketEvents.FOR_AUTHORITY}:${ID}`;
  socket.join(authoritiesSocketsRoom);
  io.in(authoritiesSocketsRoom).fetchSockets().then((sockets) => {
    console.log(`${RealtimeSocketEvents.AUTHORITY_SOCKET_TRACK} - Authority ${ID} added socket id ${socket.id} to room ${authoritiesSocketsRoom} | sockets in room:`, sockets);
  });
}



// create IO server

const io = new Server({
  cors: { origin: AppEnvironment.SOCKETS.WHITELIST },

  allowRequest: (req, callback) => {
    console.log(`socket req origin: ${req.headers.origin}`);
    const useOrigin = (req.headers.origin || '');
    const originIsAllowed = !AppEnvironment.IS_ENV.PROD || AppEnvironment.SOCKETS.WHITELIST.includes(useOrigin);
    console.log({ originIsAllowed });
    callback(null, originIsAllowed);
  }
});

io.on(RealtimeIoEvents.CONNECTION, (socket: Socket) => {
  socket.on(RealtimeSocketEvents.DISCONNECT, (data: any) => {
    console.log(`disconnecting socket ${socket.id}...`);
  });

  socket.on(RealtimeSocketEvents.USER_SOCKET_TRACK, (data: any) => {
    USER_SOCKET_TRACK(io, socket, data);
  });

  socket.on(RealtimeSocketEvents.AUTHORITY_SOCKET_TRACK, (data: any) => {
    AUTHORITY_SOCKET_TRACK(io, socket, data);
  });
});

io.listen(AppEnvironment.PORT);






/** ----- Rabbit MQ ----- **/

const handleMessageTypes = [
  NotificationsQueueEventTypes.CREATED_USER_NOTIFICATION,
  NotificationsQueueEventTypes.CREATED_AUTHORITY_NOTIFICATION,
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





const realtiemEventsQueue = rmqClient.onQueue(MicroservicesQueues.REALTIME_EVENTS);

realtiemEventsQueue.handle(NotificationsQueueEventTypes.CREATED_USER_NOTIFICATION).subscribe({
  next: (event: RmqEventMessage<ServiceMethodResults<IUserNotification>>) => {
    console.log(`[${NotificationsQueueEventTypes.CREATED_USER_NOTIFICATION}] Received message:`);
    !!event.data.info.data?.for_user_id && io.to(`${RealtimeSocketEvents.FOR_USER}:${event.data.info.data!.for_user_id}`).emit(event.message.properties.type, event.data);
  }
});

realtiemEventsQueue.handle(NotificationsQueueEventTypes.CREATED_AUTHORITY_NOTIFICATION).subscribe({
  next: (event: RmqEventMessage<ServiceMethodResults<IAuthorityNotification>>) => {
    console.log(`[${NotificationsQueueEventTypes.CREATED_AUTHORITY_NOTIFICATION}] Received message:`);
    !!event.data.info.data?.for_authority_id && io.to(`${RealtimeSocketEvents.FOR_AUTHORITY}:${event.data.info.data!.for_authority_id}`).emit(event.message.properties.type, event.data);
  }
});

