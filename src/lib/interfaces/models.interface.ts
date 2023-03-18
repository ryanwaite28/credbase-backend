import { Includeable, FindAttributeOptions, GroupOption, WhereOptions, Order } from "sequelize";
import { MapType } from "./common.interface";



export interface ICommonModel extends MapType {
  id: number,
  uuid: string,
  metadata: string,
  created_at: string,
  updated_at: string,
  deleted_at: string,
}

export interface IPaginateModelsOptions {
  user_id_field: string,
  user_id?: number,
  min_id?: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
  orderBy?: Order
}

export interface IRandomModelsOptions {
  limit?: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
}