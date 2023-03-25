import { create_model_crud_repo_from_model_class } from '@lib/backend-shared';
import { CreateItemDto, IItem, IItemField, ItemFieldDto } from '@lib/fullstack-shared';
import { Item, ItemField } from './items.database';

export const item_crud = create_model_crud_repo_from_model_class<IItem>(Item);
export const item_field_crud = create_model_crud_repo_from_model_class<IItemField>(ItemField);





export async function load_item_children_fields(item_field: IItemField) {
  if (item_field.has_children) {
    const children_fields = await get_item_fields_by_parent_field_id(item_field.id);
    item_field.fields = children_fields;

    for await (const child_field of children_fields) {
      await load_item_children_fields(child_field);
    }
  }
}

export function get_item_by_id(id: number) {
  return item_crud.findOne({
    where: { id },
    include:[{ model: ItemField, as: 'fields' }]
  });
}

export function get_item_with_fields_by_id(id: number) {
  return item_crud.findOne({
    where: { id },
    include:[
      { model: ItemField, as: 'fields' }
    ]
  })
  .then(async (item: IItem | null) => {
    if (!item) {
      return item;
    }

    if (item.fields?.length) {
      for await (const item_field of item.fields) {
        await load_item_children_fields(item_field);
      }
    }

    return item;
  });
}

export function get_item_by_uuid(uuid: string) {
  return item_crud.findOne({
    where: { uuid },
  });
}

export function get_item_field_by_id(id: number) {
  return item_field_crud.findOne({
    where: { id },
  });
}

export function get_item_field_by_uuid(uuid: string) {
  return item_field_crud.findOne({
    where: { uuid },
  });
}




export async function get_items_by_user_id(user_id: number) {
  return item_crud.findAll({
    where: { user_id },
  });
}

export async function get_items_by_user_id_paginate(params: {
  user_id: number,
  min_id?: number,
  limit?: number,
}) {
  return item_crud.paginate({
    parent_model_id_field: 'user_id',
    parent_model_id: params.user_id,
    min_id: params.min_id,
    limit: params.limit,
  });
}

export async function get_items_by_asset_id(asset_id: number) {
  return item_crud.findAll({
    where: { asset_id },
  });
}

export async function get_items_by_asset_id_paginate(params: {
  asset_id: number,
  min_id?: number,
  limit?: number,
}) {
  return item_crud.paginate({
    parent_model_id_field: 'asset_id',
    parent_model_id: params.asset_id,
    min_id: params.min_id,
    limit: params.limit,
  });
}




export async function get_item_fields_by_item_id(item_id: number) {
  return item_field_crud.findAll({
    where: { item_id, parent_field_id: null },
  });
}

export async function get_item_fields_by_item_id_paginate(params: {
  item_id: number,
  min_id?: number,
  limit?: number,
}) {
  return item_crud.paginate({
    parent_model_id_field: 'item_id',
    parent_model_id: params.item_id,
    min_id: params.min_id,
    limit: params.limit,
    whereClause: { parent_field_id: null }
  });
}

export async function get_item_fields_by_parent_field_id(parent_field_id: number) {
  return item_field_crud.findAll({
    where: { parent_field_id },
  });
}

export async function get_item_fields_by_parent_field_id_paginate(params: {
  parent_field_id: number,
  min_id?: number,
  limit?: number,
}) {
  return item_crud.paginate({
    parent_model_id_field: 'parent_field_id',
    parent_model_id: params.parent_field_id,
    min_id: params.min_id,
    limit: params.limit,
  });
}




export async function create_children_fields(item: IItem, parent_field: IItemField, parentFieldDto: ItemFieldDto) {
  if (parentFieldDto.fields && parentFieldDto.fields.length > 0) {
    if (!parent_field.fields) {
      parent_field.fields = [];
    }

    for await (const childFieldDto of parentFieldDto.fields) {
      const child_field = await item_field_crud.create({
        item_id: item.id,
        parent_field_id: parent_field.id,
        has_children: !!childFieldDto.fields && childFieldDto.fields.length > 0,
        name: childFieldDto.name,
        value: childFieldDto.value,
        type: childFieldDto.type,
      });
      parent_field.fields.push(child_field);
  
      await create_children_fields(item, child_field, childFieldDto); // recursively create children fields until there are none left
    }
  }
}
export async function create_item(params: CreateItemDto) {
  const item = await item_crud.create({
    user_id: params.user_id,
    asset_id: params.asset_id,
    title: params.title,
    description: params.description,
    active: params.active,
  });

  if (!item.fields) {
    item.fields = [];
  }

  for await (const fieldDto of params.fields) {
    const field = await item_field_crud.create({
      item_id: item.id,
      parent_field_id: null,
      has_children: !!fieldDto.fields && fieldDto.fields.length > 0,
      name: fieldDto.name,
      value: fieldDto.value,
      type: fieldDto.type,
    });
    item.fields.push(field);

    await create_children_fields(item, field, fieldDto); // start recursively create children fields
  }

  return item;
}