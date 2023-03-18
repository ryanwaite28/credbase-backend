import {
  fn,
  col,
  Op,
  WhereOptions,
  FindOptions,
  Includeable,
  Model,
  FindAttributeOptions,
  GroupOption,
  Order,
} from "sequelize";
import { MapType } from "../interfaces/common.interface";
import { IPaginateModelsOptions, IRandomModelsOptions } from "../interfaces/models.interface";
import { convertModels, convertModel, MyModelStatic } from "./db.helper";






export async function paginateTable(model: MyModelStatic, options: IPaginateModelsOptions)  {
  const { user_id_field, user_id, min_id, include, attributes, group, whereClause, orderBy } = options;

  const useWhereClause: WhereOptions = <MapType> (!min_id
    ? { [user_id_field]: user_id }
    : { [user_id_field]: user_id, id: { [Op.lt]: min_id } }
  );
  if (whereClause) {
    Object.assign(useWhereClause, whereClause);
  }

  console.log(whereClause, { useWhereClause });

  const models: Model[] = await model.findAll({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
    limit: 5,
    order: orderBy || [['id', 'DESC']]
  });

  return models;
}

export async function getCount(
  model: MyModelStatic,
  user_id_field: string,
  user_id: number,
  group?: GroupOption,
  whereClause?: WhereOptions,
)  {
  // const models = await model.findAll<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, [user_id_field]: user_id }
    : { [user_id_field]: user_id };

  const models = await (model as MyModelStatic).count({
    group: group || {} as GroupOption,
    where: useWhereClause,
  });

  return models;
}

export async function getAll(
  model: MyModelStatic | any,
  user_id_field: string,
  user_id: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
  orderBy?: Order
)  {
  // const models = await model.findAll<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, [user_id_field]: user_id }
    : { [user_id_field]: user_id };

  if (whereClause) {
    Object.assign(useWhereClause, whereClause);
  }
  console.log(whereClause, { useWhereClause });

  const models = await (model as MyModelStatic).findAll({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
    order: orderBy || [['id', 'DESC']]
  });

  return models;
}

export async function getById<T>(
  model: MyModelStatic | any,
  id: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
)  {
  // const result = await model.findOne<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, id }
    : { id };

  console.log(whereClause, { useWhereClause });

  const result = await (model as MyModelStatic).findOne({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
  });

  return result;
}

export async function getRandomModels<T>(model: MyModelStatic, params: IRandomModelsOptions) {
  const { limit, include, attributes, group } = params;

  try {
    const results = await (<any> model).findAll({
      limit: limit || 10,
      order: [fn( 'RANDOM' )],
      attributes,
      group,
      include,
    });

    return results;
  } 
  catch (e) {
    console.log(`get_random_models error - `, e);
    return null;
  }
}

export function get_recent_models<T = any>(
  model: MyModelStatic,
  whereClause: WhereOptions = {},
) {
  return model.findAll({
    where: whereClause,
    order: [['id', 'DESC']],
    limit: 20,
  })
  .then((models: Model[]) => {
    return convertModels<T>(<Model[]> models);
  });
}





// converted

export async function paginateTableConverted<T>(
  model: MyModelStatic | any,
  user_id_field: string,
  user_id?: number,
  min_id?: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
  orderBy?: Order
)  {
  const useWhereClause: WhereOptions = <MapType> (!min_id
    ? { [user_id_field]: user_id }
    : { [user_id_field]: user_id, id: { [Op.lt]: min_id } }
  );
  if (whereClause) {
    Object.assign(useWhereClause, whereClause);
  }

  console.log(whereClause, { useWhereClause });

  const models = await (model as MyModelStatic).findAll({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
    limit: 5,
    order: orderBy || [['id', 'DESC']]
  })
  .then((models: Model[]) => {
    return convertModels<T>(models);
  });

  return models;
}

export async function getAllConverted<T>(
  model: MyModelStatic | any,
  user_id_field: string,
  user_id: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
  orderBy?: Order
)  {
  // const models = await model.findAll<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, [user_id_field]: user_id }
    : { [user_id_field]: user_id };

  if (whereClause) {
    Object.assign(useWhereClause, whereClause);
  }
  console.log(whereClause, { useWhereClause });

  const models = await (model as MyModelStatic).findAll({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
    order: orderBy || [['id', 'DESC']]
  });

  return models;
}

export async function getByIdConverted<T>(
  model: MyModelStatic | Model,
  id: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
)  {
  // const result = await model.findOne<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, id }
    : { id };

  console.log(whereClause, { useWhereClause });

  const result = await (model as MyModelStatic).findOne({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
  })
  .then((model: Model | null) => {
    return convertModel<T>(model);
  });

  return result;
}

export async function getRandomModelsConverted<T>(
  model: MyModelStatic,
  limit: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
) {
  try {
    const results = await (<any> model).findAll({
      limit,
      order: [fn( 'RANDOM' )],
      attributes,
      group,
      include,
    })
    .then((models: Model[]) => {
      return convertModels<T>(models);
    });

    return results;
  } 
  catch (e) {
    console.log(`get_random_models error - `, e);
    return null;
  }
}

export function get_recent_models_converted<T>(
  model: MyModelStatic | Model,
  whereClause: WhereOptions = {},
) {
  return (model as MyModelStatic).findAll({
    where: whereClause,
    order: [['id', 'DESC']],
    limit: 20,
  })
  .then((models) => {
    return convertModels<T>(<Model[]> models);
  });
}




export async function get_user_ratings_stats_via_model(ratingsModel: MyModelStatic, id: number): Promise<{
  user_ratings_info: any | null,
  writer_ratings_info: any | null,
}> {
  const user_ratings_info = await ratingsModel.findOne({
    where: { user_id: id },
    attributes: [
      [fn('AVG', col('rating')), 'ratingsAvg'],
      [fn('COUNT', col('rating')), 'ratingsCount'],
    ],
    group: ['user_id'],
  })
  .then((model: Model | null) => {
    return convertModel<any>(model);
  });

  const writer_ratings_info = await ratingsModel.findOne({
    where: { writer_id: id },
    attributes: [
      [fn('AVG', col('rating')), 'ratingsAvg'],
      [fn('COUNT', col('rating')), 'ratingsCount'],
    ],
    group: ['writer_id'],
  })
  .then((model: Model | null) => {
    return convertModel<any>(model)!;
  });

  return {
    user_ratings_info,
    writer_ratings_info,
  }
}
