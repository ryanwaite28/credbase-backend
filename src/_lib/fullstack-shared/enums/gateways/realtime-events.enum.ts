export enum RealtimeIoEvents {
  CONNECTION = "connection"
}

export enum RealtimeSocketEvents {
  DISCONNECT = "disconnect",
  USER_SOCKET_TRACK = 'USER_SOCKET_TRACK',
  AUTHORITY_SOCKET_TRACK = 'AUTHORITY_SOCKET_TRACK',
  SOCKET_TRACK_ERROR = 'SOCKET_TRACK_ERROR',
  SOCKET_UNTRACK = 'SOCKET_UNTRACK',
  FOR_USER = "FOR_USER",
  FOR_AUTHORITY = "FOR_AUTHORITY",
}