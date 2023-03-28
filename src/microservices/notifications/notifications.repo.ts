import { create_model_crud_repo_from_model_class } from '@lib/backend-shared';
import {
  CreateAuthorityNotificationDto,
  CreateUserNotificationDto,
  IAuthorityNotification,
  IAuthorityNotificationLastOpened,
  IUserNotification,
  IUserNotificationLastOpened
} from '@lib/fullstack-shared';
import {
  AuthorityNotification,
  AuthorityNotificationLastOpened,
  UserNotification,
  UserNotificationLastOpened
} from './notifications.database';



export const user_notification_crud = create_model_crud_repo_from_model_class<IUserNotification>(UserNotification);
export const user_notification_last_opened_crud = create_model_crud_repo_from_model_class<IUserNotificationLastOpened>(UserNotificationLastOpened);

export const authority_notification_crud = create_model_crud_repo_from_model_class<IAuthorityNotification>(AuthorityNotification);
export const authority_notification_last_opened_crud = create_model_crud_repo_from_model_class<IAuthorityNotificationLastOpened>(AuthorityNotificationLastOpened);





export async function get_user_notifications_last_opened(user_id: number) {
  let notification_last_opened = await user_notification_last_opened_crud.findById(user_id);
  if (!notification_last_opened) {
    notification_last_opened = await user_notification_last_opened_crud.create({ user_id });
  }
  return notification_last_opened;
}

export async function get_user_notifications(for_user_id: number) {
  return user_notification_crud.findAll({
    where: { for_user_id },
  });
}

export async function get_user_notifications_paginate(params: {
  for_user_id: number,
  min_id?: number,
  limit?: number,
}) {
  return user_notification_crud.paginate({
    parent_model_id_field: 'for_user_id',
    parent_model_id: params.for_user_id,
    min_id: params.min_id,
    limit: params.limit,
  });
}

export async function create_user_notification(params: CreateUserNotificationDto) {
  return user_notification_crud.create(params);
}





export async function get_authority_notifications_last_opened(authority_id: number) {
  let notification_last_opened = await authority_notification_last_opened_crud.findById(authority_id);
  if (!notification_last_opened) {
    notification_last_opened = await authority_notification_last_opened_crud.create({ authority_id });
  }
  return notification_last_opened;
}

export async function get_authority_notifications(for_authority_id: number) {
  return authority_notification_crud.findAll({
    where: { for_authority_id },
  });
}

export async function get_authority_notifications_paginate(params: {
  for_authority_id: number,
  min_id?: number,
  limit?: number,
}) {
  return authority_notification_crud.paginate({
    parent_model_id_field: 'for_authority_id',
    parent_model_id: params.for_authority_id,
    min_id: params.min_id,
    limit: params.limit,
  });
}

export async function create_authority_notification(params: CreateAuthorityNotificationDto) {
  return authority_notification_crud.create(params);
}