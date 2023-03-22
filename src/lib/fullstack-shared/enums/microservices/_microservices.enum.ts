export enum ContentTypes {
  JSON = 'application/json',
  TEXT = 'text/plain',
  STREAM = 'application/octet-stream'
}

export enum RoutingKeys {
  MESSAGE = 'MESSAGE', // instruction to do something
  EVENT = 'EVENT', // results of instruction
}




export enum MicroservicesQueues {
  USER_MESSAGES = 'USER_MESSAGES_QUEUE',
  USER_EVENTS = 'USER_EVENTS_QUEUE',
  AUTHORITY_MESSAGES = "AUTHORITY_MESSAGES",
  AUTHORITY_EVENTS = "AUTHORITY_EVENTS",
  EMAILS = "EMAILS",
}


export enum MicroservicesExchanges {
  USER_MESSAGES = 'USER_MESSAGES_EXCHANGE',
  USER_EVENTS = 'USER_EVENTS_EXCHANGE',
  AUTHORITY_MESSAGES = "AUTHORITY_MESSAGES",
  AUTHORITY_EVENTS = "AUTHORITY_EVENTS",
}
