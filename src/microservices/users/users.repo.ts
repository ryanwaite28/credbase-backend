import {
  col,
  fn,
  Model,
  Op,
  where,
  WhereOptions
} from 'sequelize';
import {
  create_model_crud_repo_from_model_class,
  IUser,
  UserSignUpDto,
  user_attrs_slim
} from '@lib/shared';
import { User } from './users.database';


export const user_crud = create_model_crud_repo_from_model_class<IUser>(User);





export async function get_user_by_id(id: number) {
  const user_model = await user_crud.findOne({
    where: { id },
    // include: [{
    //   model: UserExpoDevice,
    //   as: `expo_devices`,
    // }],
    attributes: {
      exclude: ['password']
    }
  });
  return user_model;
}

export async function get_user_by_email(email: string) {
  try {
    const userModel = await user_crud.findOne({
      where: { email },
      attributes: user_attrs_slim
    })
    return userModel;
  } catch (e) {
    console.log(`get_user_by_email error - `, e);
    return null;
  }
}

export async function get_user_by_phone(phone: string) {
  try {
    const userModel = await user_crud.findOne({
      where: { phone },
      attributes: user_attrs_slim,
      // include: [{
      //   model: UserExpoDevice,
      //   as: `expo_devices`,
      // }],
    });
    return userModel;
  } catch (e) {
    console.log(`get_user_by_phone error - `, e);
    return null;
  }
}


export async function create_user(params: UserSignUpDto) {
  const createOptions = { ...params };
  const new_user_model = await User.create(createOptions);
  const user = await get_user_by_id(new_user_model.dataValues.id);
  return user!;
}