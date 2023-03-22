import {
  create_model_crud_repo_from_model_class,
  IAuthority,
  CreateAuthorityDto,
  UpdateAuthorityDto
} from '@lib/shared';
import { Authority } from './authorities.database';


export const authority_crud = create_model_crud_repo_from_model_class<IAuthority>(Authority);



export async function get_authorities() {
  return authority_crud.findAll({
    attributes: {
      exclude: ['password']
    }
  });
}

export async function get_authority_by_id(id: number) {
  return authority_crud.findOne({
    where: { id },
    attributes: {
      exclude: ['password']
    }
  });
}

export async function get_authority_by_email(email: string) {
  return authority_crud.findOne({
    where: { email },
    attributes: {
      exclude: ['password']
    }
  });
}

export async function get_authority_password_by_id(id: number) {
  return authority_crud.findOne({
    where: { id },
    attributes: ['password']
  });
}

export async function get_authority_password_by_email(email: string) {
  return authority_crud.findOne({
    where: { email },
    attributes: ['password']
  });
}

export async function get_authority_by_phone(phone: string) {
  return authority_crud.findOne({
    where: { phone },
    attributes: {
      exclude: ['password']
    }
  });
}


export async function create_authority(params: CreateAuthorityDto) {
  const createOptions = { ...params };
  const new_authority = await authority_crud.create(createOptions);
  const authority = await get_authority_by_id(new_authority.id);
  return authority!;
}

export async function update_authority(id: number, params: UpdateAuthorityDto) {
  const updateOptions = { ...params };
  await authority_crud.updateById(id, updateOptions);
  const authority = await get_authority_by_id(id);
  return authority!;
}

export async function delete_authority(id: number) {
  const results = await authority_crud.deleteById(id);
  return results;
}