export enum ContentTypes {
  JSON = 'application/json',
  TEXT = 'text/plain',
  STREAM = 'application/octet-stream'
}

export enum MimeTypes {
  AAC = "audio/aac",
  ABW = "application/x-abiword",
  ARC = "application/x-freearc",
  AVI = "video/x-msvideo",
  AZW = "application/vnd.amazon.ebook",
  BIN = "application/octet-stream",
  BMP = "image/bmp",
  BZ = "application/x-bzip",
  BZ2 = "application/x-bzip2",
  CSH = "application/x-csh",
  CSS = "text/css",
  CSV = "text/csv",
  DOC = "application/msword",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  EOT = "application/vnd.ms-fontobject",
  EPUB = "application/epub+zip",
  GZ = "application/gzip",
  GIF = "image/gif",
  HTM = "text/html",
  HTML = "text/html",
  ICO = "image/vnd.microsoft.icon",
  ICS = "text/calendar",
  JAR = "application/java-archive",
  JPEG = "jpg",
  JS = "text/javascript",
  JSON = "application/json",
  JSONLD = "application/ld+json",
  MID = ".midi",
  MJS = "text/javascript",
  MP3 = "audio/mpeg",
  MPEG = "video/mpeg",
  MPKG = "application/vnd.apple.installer+xml",
  ODP = "application/vnd.oasis.opendocument.presentation",
  ODS = "application/vnd.oasis.opendocument.spreadsheet",
  ODT = "application/vnd.oasis.opendocument.text",
  OGA = "audio/ogg",
  OGV = "video/ogg",
  OGX = "application/ogg",
  OPUS = "audio/opus",
  OTF = "font/otf",
  PNG = "image/png",
  PDF = "application/pdf",
  PHP = "application/php",
  PPT = "application/vnd.ms-powerpoint",
  PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  RAR = "application/vnd.rar",
  RTF = "application/rtf",
  SH = "application/x-sh",
  SVG = "image/svg+xml",
  SWF = "application/x-shockwave-flash",
  TAR = "application/x-tar",
  TIF = "image/tiff",
  TIFF = "image/tiff",
  TS = "video/mp2t",
  TTF = "font/ttf",
  TXT = "text/plain",
  VSD = "application/vnd.visio",
  WAV = "audio/wav",
  WEBA = "audio/webm",
  WEBM = "video/webm",
  WEBP = "image/webp",
  WOFF = "font/woff",
  WOFF2 = "font/woff2",
  XHTML = "application/xhtml+xml",
  XLS = "application/vnd.ms-excel",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  XML = "XML",
  XUL = "application/vnd.mozilla.xul+xml",
  ZIP = "application/zip",
  VIDEO_3GP = "video/3gpp",
  VIDEO_3G2 = "video/3gpp2",
  COMPRESS_7Z = "application/x-7z-compressed"
}

export enum RoutingKeys {
  MESSAGE = 'MESSAGE', // instruction to do something
  EVENT = 'EVENT', // results of instruction
}

export enum Models {
  USER = "USER",
  AUTHORITY = "AUTHORITY",
  CLIENT = "CLIENT",
  ASSET = "ASSET",
  ITEM = "ITEM",
}







export enum MicroservicesQueues {
  EMAILS = "EMAILS_QUEUE",
  LOGGING = "LOGGING_QUEUE",

  CACHE_MESSAGES = 'CACHE_MESSAGES_QUEUE',
  CACHE_EVENTS = 'CACHE_EVENTS_QUEUE',
  
  USER_MESSAGES = 'USER_MESSAGES_QUEUE',
  USER_EVENTS = 'USER_EVENTS_QUEUE',

  AUTHORITY_MESSAGES = "AUTHORITY_MESSAGES_QUEUE",
  AUTHORITY_EVENTS = "AUTHORITY_EVENTS_QUEUE",

  CLIENT_MESSAGES = "CLIENT_MESSAGES_QUEUE",
  CLIENT_EVENTS = "CLIENT_EVENTS_QUEUE",

  ASSET_MESSAGES = "ASSET_MESSAGES_QUEUE",
  ASSET_EVENTS = "ASSET_EVENTS_QUEUE",

  ITEM_MESSAGES = "ITEM_MESSAGES_QUEUE",
  ITEM_EVENTS = "ITEM_EVENTS_QUEUE",

  STORAGE_MESSAGES = "STORAGE_MESSAGES_QUEUE",
  STORAGE_EVENTS = "STORAGE_EVENTS_QUEUE",

  DEVELOPER_MESSAGES = "DEVELOPER_MESSAGES_QUEUE",
  DEVELOPER_EVENTS = "DEVELOPER_EVENTS_QUEUE",

  STRIPE_MESSAGES = "STRIPE_MESSAGES_QUEUE",
  STRIPE_EVENTS = "STRIPE_EVENTS_QUEUE",
}




export enum MicroservicesExchanges {
  EMAIL_EVENTS = "EMAIL_EVENTS_EXCHANGE",
  CACHE_EVENTS = 'CACHE_EVENTS_EXCHANGE',

  
  USER_MESSAGES = 'USER_MESSAGES_EXCHANGE',
  USER_EVENTS = 'USER_EVENTS_EXCHANGE',

  AUTHORITY_MESSAGES = "AUTHORITY_MESSAGES_EXCHANGE",
  AUTHORITY_EVENTS = "AUTHORITY_EVENTS_EXCHANGE",

  CLIENT_MESSAGES = "CLIENT_MESSAGES_EXCHANGE",
  CLIENT_EVENTS = "CLIENT_EVENTS_EXCHANGE",

  ASSET_MESSAGES = "ASSET_MESSAGES_EXCHANGE",
  ASSET_EVENTS = "ASSET_EVENTS_EXCHANGE",

  ITEM_MESSAGES = "ITEM_MESSAGES_EXCHANGE",
  ITEM_EVENTS = "ITEM_EVENTS_EXCHANGE",

  STORAGE_MESSAGES = "STORAGE_MESSAGES_EXCHANGE",
  STORAGE_EVENTS = "STORAGE_EVENTS_EXCHANGE",

  DEVELOPER_MESSAGES = "DEVELOPER_MESSAGES_EXCHANGE",
  DEVELOPER_EVENTS = "DEVELOPER_EVENTS_EXCHANGE",

  STRIPE_MESSAGES = "STRIPE_MESSAGES_EXCHANGE",
  STRIPE_EVENTS = "STRIPE_EVENTS_EXCHANGE",
}
