import { S3ObjectContexts } from "../../enums/microservices/storage.enum";
import { ICommonModel } from "../../interfaces/common.interface";
import { CreateS3ObjectDto } from "./storage.dto";


export interface IS3Object extends ICommonModel {
  model_type: string | null,
  model_id: string | null,
  name: string,
  description: string,
  extension: string,
  mimetype: string,
  size: number,
  s3_url: string,
  bucket: string,
  path_key: string,
}

export interface ICreateS3ObjectRmqMessage {
  buffer: Buffer,
  createOptions: CreateS3ObjectDto,
  context: S3ObjectContexts,
}

export interface IS3ModelObjectParams {
  model_type: string,
  model_id: number
}
