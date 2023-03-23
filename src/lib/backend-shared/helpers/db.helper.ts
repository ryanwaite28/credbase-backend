

/**
 * @see: https://sequelize.org/master/manual/typescript
 */

import { Model, BuildOptions, CreateOptions, FindOptions, UpdateOptions, DestroyOptions } from "sequelize";
import { IPaginateModelsOptions, IRandomModelsOptions } from "../interfaces/models.interface";
import { paginateTable, getRandomModels } from "./_common.repo";




export const getSequelizeModelData = <T = any> (model: Model | null): T | null => {
  return model ? model.dataValues as T : null;
}

export const getSequelizeModelsData = <T = any> (models: Model[]): T[] => {
  return models.map((model) => model.dataValues as T);
}



export const convertModel = <T> (model: Model | null): T | null => {
  return model ? (<any> model.toJSON()) as T : null;
}

export const convertModels = <T> (models: Model[]) => {
  return models.map((model) => (<any> model.toJSON()) as T);
}

export const convertModelCurry = <T> () => (model: Model | null): T | null => {
  return model ? (model.toJSON()) as T : null;
}

export const convertModelsCurry = <T> () => (models: Model[]) => {
  return models.map((model) => (<any> model.toJSON()) as T);
}


/** Model Class Type */

export interface IMyModel extends Model<any> {
  readonly id: number;
  [key: string]: any;
}

export type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IMyModel;
};


export const create_model_crud_repo_from_model_class = <T> (givenModelClass: MyModelStatic) => {
  // console.log({ givenModelClass });
  if (!givenModelClass) {
    throw new Error(`Model is required...`);
  }

  const convertTypeCurry = convertModelCurry<T>();
  const convertTypeListCurry = convertModelsCurry<T>();
  const modelClass = givenModelClass as MyModelStatic;

  const create = (createObj: any, createOptions?: CreateOptions) => {
    return modelClass.create(createObj, createOptions).then(convertTypeCurry).then(model => model!);
  };

  const count = (findOptions: FindOptions) => {
    return modelClass.count(findOptions);
  };



  const findOne = (findOptions: FindOptions<T>) => {
    return modelClass.findOne(findOptions).then(convertTypeCurry);
  };
  const findById = (id: number, findOptions?: FindOptions<T>) => {
    const useWhere = findOptions
      ? { ...findOptions, where: { id } }
      : { where: { id } };
    return modelClass.findOne(useWhere).then(convertTypeCurry);
  };
  const findAll = (findOptions: FindOptions<T>) => {
    return modelClass.findAll(findOptions).then(convertTypeListCurry);
  };



  const update = (updateObj: any, options: UpdateOptions<T>) => {
    return modelClass.update(updateObj, { ...options, returning: true })
      .then((updates) => ({ rows: updates[0], models: updates[1].map(convertTypeCurry) }));
  };
  const updateById = (id: number, updateObj: any) => {
    return modelClass.update(updateObj, { where: { id }, returning: true })
      .then((updates) => ({ rows: updates[0], model: updates[1][0] && convertTypeCurry(updates[1][0]) }));
    // .then(async (updates) => {
    //   const fresh = await findById(id);
    //   // return updates;
    //   const returnValue = [updates[0], fresh] as [number, (T|null)];
    //   return returnValue;
    // });
  };



  const deleteFn = async (destroyOptions: DestroyOptions<T>) => {
    const results = await modelClass.destroy(destroyOptions);
    const models = !destroyOptions.where ? [] : await modelClass.findAll({ where: destroyOptions.where, paranoid: false }).then(convertTypeListCurry);
    return { results, models };
  };
  const deleteById = async (id: number) => {
    const results = await modelClass.destroy({ where: { id } });
    const model = await modelClass.findOne({ where: { id }, paranoid: false }).then(convertTypeCurry);
    return { results, model };
  };


  const paginate = (params: IPaginateModelsOptions) => {
    return paginateTable(modelClass, params).then(convertTypeListCurry);
  };

  const randomModels = (params: IRandomModelsOptions) => {
    return getRandomModels<T>(modelClass, params).then(convertTypeListCurry);
  };

  

  return {
    create,
  
    findOne,
    findAll,
    findById,
    count,

    update,
    updateById,

    destroy: deleteFn,
    delete: deleteFn,
    deleteById,

    paginate,
    randomModels,
  };

};