import { create_model_crud_repo_from_model_class } from '@lib/backend-shared';
import { IAuthorityPasswordReset, IUserPasswordReset } from '@lib/fullstack-shared';
import { fn, Op } from 'sequelize';
import { UserPasswordReset, AuthorityPasswordReset } from './password-resets.database';



export const user_password_reset_crud = create_model_crud_repo_from_model_class<IUserPasswordReset>(UserPasswordReset);

export const authority_password_reset_crud = create_model_crud_repo_from_model_class<IAuthorityPasswordReset>(AuthorityPasswordReset);





export function get_user_password_reset_by_user_id_and_email(user_id: number, user_email: string) {
  return user_password_reset_crud.findOne({
    where: { user_id, user_email }
  });
}


export function get_user_password_reset_by_active_status(user_id: number, user_email: string) {
  return user_password_reset_crud.findOne({
    where: { user_id, user_email, used: false, expire_by: { [Op.gte]: fn('NOW') } }
  });
}

export function mark_user_password_reset_as_used_by_uuid(uuid: string) {
  return user_password_reset_crud.update({ used: true }, { where: { uuid } });
}

export function delete_user_password_reset_by_uuid(uuid: string) {
  return user_password_reset_crud.delete({
    where: { uuid }
  });
}



export function get_authority_password_reset_by_authority_id_and_email(authority_id: number, authority_email: string) {
  return authority_password_reset_crud.findOne({
    where: { authority_id, authority_email }
  });
}


export function get_authority_password_reset_by_active_status(authority_id: number, authority_email: string) {
  return authority_password_reset_crud.findOne({
    where: { authority_id, authority_email, used: false, expire_by: { [Op.gte]: fn('NOW') } }
  });
}

export function mark_authority_password_reset_as_used_by_uuid(uuid: string) {
  return authority_password_reset_crud.update({ used: true }, { where: { uuid } });
}

export function delete_authority_password_reset_by_uuid(uuid: string) {
  return authority_password_reset_crud.delete({
    where: { uuid }
  });
}
