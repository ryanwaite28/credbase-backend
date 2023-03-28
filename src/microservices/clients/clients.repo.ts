import { create_model_crud_repo_from_model_class } from '@lib/backend-shared';
import { AddClientDto, AddClientRequestDto, COMMON_STATUSES, IClient, IClientRequest } from '@lib/fullstack-shared';
import { Client, ClientRequest } from './clients.database';


export const client_crud = create_model_crud_repo_from_model_class<IClient>(Client);
export const client_request_crud = create_model_crud_repo_from_model_class<IClientRequest>(ClientRequest);



export function get_client_by_id(id: number) {
  return client_crud.findOne({
    where: { id },
  });
}

export function get_client_by_uuid(uuid: string) {
  return client_crud.findOne({
    where: { uuid },
  });
}

export async function get_clients_by_authority_id(authority_id: number) {
  return client_crud.findAll({
    where: { authority_id },
  });
}

export async function get_clients_by_authority_id_paginate(params: {
  authority_id: number,
  min_id?: number,
  limit?: number,
}) {
  return client_crud.paginate({
    parent_model_id_field: 'authority_id',
    parent_model_id: params.authority_id,
    min_id: params.min_id,
    limit: params.limit,
  });
}

export async function get_clients_by_user_id(user_id: number) {
  return client_crud.findAll({
    where: { user_id },
  });
}

export async function get_clients_by_user_id_paginate(params: {
  user_id: number,
  min_id?: number,
  limit?: number,
}) {
  return client_crud.paginate({
    parent_model_id_field: 'user_id',
    parent_model_id: params.user_id,
    min_id: params.min_id,
    limit: params.limit,
  });
}


export async function add_client(params: AddClientDto) {
  return client_crud.create(params);
}


export async function add_client_request(params: AddClientRequestDto) {
  return client_request_crud.create(params);
}

export async function check_client_request(params: AddClientDto) {
  return client_request_crud.findOne({ where: { ...params } });
}

export async function check_pending_client_request(params: AddClientDto) {
  return client_request_crud.findOne({ where: { ...params, status: COMMON_STATUSES.PENDING } });
}

export async function cancel_client_request(requet_id: number) {
  return client_request_crud.updateById(requet_id, { status: COMMON_STATUSES.CANCELED });
}

export async function accept_client_request(requet_id: number) {
  return client_request_crud.updateById(requet_id, { status: COMMON_STATUSES.ACCEPTED });
}

export async function decline_client_request(requet_id: number) {
  return client_request_crud.updateById(requet_id, { status: COMMON_STATUSES.DECLINED });
}