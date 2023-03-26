import { ICommonModel } from "../../interfaces/common.interface";


export interface IUserPasswordReset extends ICommonModel {
  user_id: number,
  user_email: string,
  expire_by: string,
  used: boolean,
}

export interface IAuthorityPasswordReset extends ICommonModel {
  authority_id: number,
  authority_email: string,
  expire_by: string,
  used: boolean,
}