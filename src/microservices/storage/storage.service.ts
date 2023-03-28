import {
  RmqEventMessage,
  RabbitMQClient,
  ServiceMethodResults,
  AppEnvironment
} from "@lib/backend-shared";
import {
  StoragesQueueMessageTypes,
  MicroservicesExchanges,
  RoutingKeys,
  StoragesQueueEventTypes,
  ContentTypes,
  HttpStatusCode,
  IS3ModelObjectParams,
  CreateS3ObjectDto,
  ICreateS3ObjectRmqMessage,
  uniqueValue
} from "@lib/fullstack-shared";
import { AwsS3Service } from "./s3.utils";
import { create_s3Object, delete_s3Objects_by_model, delete_s3Object_by_id, get_s3Objects_by_model, get_s3Object_by_id } from "./storage.repo";






export async function FETCH_S3OBJECT_BY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${StoragesQueueMessageTypes.FETCH_S3OBJECT_BY_ID}] Received message:`);

  const data = await get_s3Object_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: StoragesQueueEventTypes.FETCHED_S3OBJECT_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function FETCH_S3OBJECTS_BY_MODEL(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${StoragesQueueMessageTypes.FETCH_S3OBJECTS_BY_MODEL}] Received message:`);

  const data = await get_s3Objects_by_model(event.data as IS3ModelObjectParams);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: StoragesQueueEventTypes.FETCHED_S3OBJECTS_BY_MODEL,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function DELETE_S3OBJECT_BY_ID(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${StoragesQueueMessageTypes.DELETE_S3OBJECT_BY_ID}] Received message:`);

  const data = await delete_s3Object_by_id(event.data.id);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: StoragesQueueEventTypes.DELETED_S3OBJECT_BY_ID,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function DELETE_S3OBJECTS_BY_MODEL(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${StoragesQueueMessageTypes.DELETE_S3OBJECTS_BY_MODEL}] Received message:`);

  const data = await delete_s3Objects_by_model(event.data as IS3ModelObjectParams);

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: StoragesQueueEventTypes.DELETED_S3OBJECTS_BY_MODEL,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}

export async function CREATE_S3OBJECT(event: RmqEventMessage, rmqClient: RabbitMQClient) {
  console.log(`[${StoragesQueueMessageTypes.CREATE_S3OBJECT}] Received message:`);

  const uploadS3Params = event.data as ICreateS3ObjectRmqMessage;

  // first, check if the designated bucket exists; if not, create it
  const Bucket = AppEnvironment.AWS.S3.BUCKET;
  const bucketExists = await AwsS3Service.bucketExists(Bucket);
  if (!bucketExists) {
    await AwsS3Service.createBucket(Bucket);
  }

  // create unique filename (s3 object key) to avoid collisions
  const unique_filename = `${uniqueValue()}.${uploadS3Params.createOptions.extension}`;
  // parse params to decide where file will be uploaded to 
  const Key = !!uploadS3Params.createOptions.model_type
    ? `${uploadS3Params.context}/${uploadS3Params.createOptions.model_type}/${unique_filename}`
    : `${uploadS3Params.context}/${unique_filename}`;

  // upload the object
  const results = await AwsS3Service.createObject({ Bucket, Key, Body: uploadS3Params.buffer });
  const s3_url = `https://${Bucket}.s3.amazonaws.com/${Key}`;
  // record upload in database
  const s3Object = await create_s3Object({
    createObject: uploadS3Params.createOptions,
    upload: { bucket: Bucket, path_key: Key },
    s3_url
  });

  

  // return results
  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: s3Object
    }
  };

  rmqClient.ack(event.message);
  return rmqClient.publishEvent({
    exchange: MicroservicesExchanges.STORAGE_EVENTS,
    routingKey: RoutingKeys.EVENT,
    data: serviceMethodResults,
    publishOptions: {
      type: StoragesQueueEventTypes.CREATED_S3OBJECT,
      contentType: ContentTypes.JSON,
      correlationId: event.message.properties.correlationId,
      replyTo: event.message.properties.replyTo,
    }
  });
}