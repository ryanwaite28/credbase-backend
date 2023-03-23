import { create_model_crud_repo_from_model_class } from '@lib/backend-shared';
import { AddClientDto, IClient } from '@lib/fullstack-shared';
import { Client } from './clients.database';


export const client_crud = create_model_crud_repo_from_model_class<IClient>(Client);



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
  return client_crud.findOne({
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
  return client_crud.findOne({
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
  const createOptions = { ...params };
  const new_client = await client_crud.create(createOptions);
  const client = await get_client_by_id(new_client.id);
  return client!;
}