import { ICommonModel } from "../../interfaces/common.interface";


export interface IItem extends ICommonModel {
  client_id: number,
  asset_id: number,
  
  title: string,
  description: string,
  active: boolean,

  fields?: IItemField[],
}

export interface IItemField extends ICommonModel {
  item_id: number,
  parent_field_id: number | null,
  has_children: boolean,
  
  key: string | null,
  name: string,
  value: string,
  type: string | null,

  fields?: IItemField[],
}