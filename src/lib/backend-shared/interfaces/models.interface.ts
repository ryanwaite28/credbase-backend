import { ICommonIconModel, ICommonWallpaperModel } from "@lib/fullstack-shared";
import {
  Includeable,
  FindAttributeOptions,
  GroupOption,
  WhereOptions,
  Order,
} from "sequelize";



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