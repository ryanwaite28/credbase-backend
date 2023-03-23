import { create_model_crud_repo_from_model_class } from '@lib/backend-shared';
import { CreateAssetDto, IAsset, UpdateAssetDto } from '@lib/fullstack-shared';
import { Asset } from './assets.database';


export const asset_crud = create_model_crud_repo_from_model_class<IAsset>(Asset);





export async function get_asset_by_id(id: number) {
  return asset_crud.findOne({
    where: { id },
  });
}

export function get_asset_by_uuid(uuid: string) {
  return asset_crud.findOne({
    where: { uuid },
  });
}

export async function get_assets_by_authority_id(authority_id: number) {
  return asset_crud.findOne({
    where: { authority_id },
  });
}

export async function get_assets_by_authority_id_paginate(params: {
  authority_id: number,
  min_id?: number,
  limit?: number,
}) {
  return asset_crud.paginate({
    parent_model_id_field: 'authority_id',
    parent_model_id: params.authority_id,
    min_id: params.min_id,
    limit: params.limit,
  });
}



export async function create_asset(params: CreateAssetDto) {
  const createOptions = { ...params };
  const new_asset = await asset_crud.create(createOptions);
  const asset = await get_asset_by_id(new_asset.id);
  return asset!;
}

export async function update_asset(id: number, params: UpdateAssetDto) {
  const updateOptions = { ...params };
  await asset_crud.updateById(id, updateOptions);
  const asset = await get_asset_by_id(id);
  return asset!;
}

export async function delete_asset(id: number) {
  const results = await asset_crud.deleteById(id);
  return results;
}