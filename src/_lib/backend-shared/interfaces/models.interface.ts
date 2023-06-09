import { ICommonIconModel, ICommonWallpaperModel } from "@lib/fullstack-shared";
import {
  Includeable,
  FindAttributeOptions,
  GroupOption,
  WhereOptions,
  Order,
} from "sequelize";



export interface IPaginateModelsOptions<T = any> {
  parent_model_id_field: string,
  parent_model_id?: number,
  min_id?: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions<T>,
  orderBy?: Order,
  limit?: number
}

export interface IRandomModelsOptions {
  limit?: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
}