import { ICommonModel } from "../../interfaces/common.interface";


export interface IClient extends ICommonModel {
  user_id: number,
  authority_id: number,
}

export interface IClientRequest extends IClient {
  requester: string,
}