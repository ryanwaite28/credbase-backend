import { ICommonModel } from "@lib/fullstack-shared/interfaces/common.interface";



export interface INotification extends ICommonModel {
  event: string,
  from_model_type: string,
  from_model_id: number,
  target_type: string,
  target_id: number,
  read: boolean,
}

export interface IUserNotification extends INotification {
  for_user_id: number,
}

export interface IAuthorityNotification extends INotification {
  for_authority_id: number,
}


export interface INotificationLastOpened extends ICommonModel {
  last_opened: string,
}

export interface IUserNotificationLastOpened extends INotificationLastOpened {
  user_id: number,
}

export interface IAuthorityNotificationLastOpened extends INotificationLastOpened {
  authority_id: number,
}