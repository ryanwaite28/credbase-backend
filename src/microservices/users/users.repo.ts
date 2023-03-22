import { create_model_crud_repo_from_model_class } from '@lib/backend-shared';
import { IUser, UserSignUpDto, UserUpdatesDto } from '@lib/fullstack-shared';
import { User } from './users.database';


export const user_crud = create_model_crud_repo_from_model_class<IUser>(User);



export async function get_users() {
  return user_crud.findAll({
    attributes: {
      exclude: ['password']
    }
  });
}

export async function get_user_by_id(id: number) {
  return user_crud.findOne({
    where: { id },
    attributes: {
      exclude: ['password']
    }
  });
}

export async function get_user_by_email(email: string) {
  return user_crud.findOne({
    where: { email },
    attributes: {
      exclude: ['password']
    }
  });
}

export async function get_user_password_by_id(id: number) {
  return user_crud.findOne({
    where: { id },
    attributes: ['password']
  });
}

export async function get_user_password_by_email(email: string) {
  return user_crud.findOne({
    where: { email },
    attributes: ['password']
  });
}

export async function get_user_by_phone(phone: string) {
  return user_crud.findOne({
    where: { phone },
    attributes: {
      exclude: ['password']
    }
  });
}


export async function create_user(params: UserSignUpDto) {
  const createOptions = { ...params };
  const new_user = await user_crud.create(createOptions);
  const user = await get_user_by_id(new_user.id);
  return user!;
}

export async function update_user(id: number, params: UserUpdatesDto) {
  const updateOptions = { ...params };
  await user_crud.updateById(id, updateOptions);
  const user = await get_user_by_id(id);
  return user!;
}

export async function delete_user(id: number) {
  const results = await user_crud.deleteById(id);
  return results;
}