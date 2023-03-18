export enum ContentTypes {
  JSON = 'application/json',
  TEXT = 'text/plain',
  STREAM = 'application/octet-stream'
}

export enum RoutingKeys {
  MESSAGE = 'MESSAGE', // instruction to do something
  EVENT = 'EVENT', // results of instruction
}