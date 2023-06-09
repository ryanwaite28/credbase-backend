// export enum S3Buckets {
//   ICONS = "credbase-icons",
//   WALLPAPERS = "credbase-wallpapers",
//   ATTACHMENTS = "credbase-attachments",
// }

export enum S3ObjectContexts {
  ICON = "ICON",
  WALLPAPER = "WALLPAPER",
  ATTACHMENT = "ATTACHMENT",
}

// export const S3ObjectContextToBucketMapping = Object.freeze({
//  [S3ObjectContexts.ICON]: S3Buckets.ICONS,
//  [S3ObjectContexts.WALLPAPER]: S3Buckets.WALLPAPERS,
//  [S3ObjectContexts.ATTACHMENT]: S3Buckets.ATTACHMENTS,
// });



export enum StoragesQueueMessageTypes {
  FETCH_S3OBJECT_BY_ID = "FETCH_S3OBJECT_BY_ID",
  FETCH_S3OBJECTS_BY_MODEL = "FETCH_S3OBJECTS_BY_MODEL",
  DELETE_S3OBJECT_BY_ID = "DELETE_S3OBJECT_BY_ID",
  DELETE_S3OBJECTS_BY_MODEL = "DELETE_S3OBJECTS_BY_MODEL",
  
  CREATE_S3OBJECT = "CREATE_S3OBJECT",
}




export enum StoragesQueueEventTypes {
  FETCHED_S3OBJECT_BY_ID = "FETCHED_S3OBJECT_BY_ID",
  FETCHED_S3OBJECTS_BY_MODEL = "FETCHED_S3OBJECTS_BY_MODEL",
  DELETED_S3OBJECT_BY_ID = "DELETED_S3OBJECT_BY_ID",
  DELETED_S3OBJECTS_BY_MODEL = "DELETED_S3OBJECTS_BY_MODEL",
  
  CREATED_S3OBJECT = "CREATED_S3OBJECT",
}
