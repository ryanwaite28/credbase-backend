import { create_model_crud_repo_from_model_class } from '@lib/backend-shared';
import { CreateS3ObjectDto, GetS3ObjectDto, IS3ModelObjectParams, IS3Object } from '@lib/fullstack-shared';
import { S3Object } from './storage.database';

export const s3Object_crud = create_model_crud_repo_from_model_class<IS3Object>(S3Object);




export function create_s3Object(params: {
  createObject: CreateS3ObjectDto,
  upload: GetS3ObjectDto,
  s3_url: string
}) {
  return s3Object_crud.create({
    ...params.createObject,
    ...params.upload,
    s3_url: params.s3_url
  });
}

export function get_s3Object_by_id(id: number) {
  return s3Object_crud.findById(id);
}

export function get_s3Objects_by_model(params: IS3ModelObjectParams) {
  return s3Object_crud.findAll({
    where: { ...params }
  });
}

export function delete_s3Object_by_id(id: number) {
  return s3Object_crud.deleteById(id);
}

export function delete_s3Objects_by_model(params: IS3ModelObjectParams) {
  return s3Object_crud.delete({
    where: { ...params }
  });
}