import {
  ICommonModel,
  ICommonIconWallpaperModel
} from "../../interfaces/models.interface";

export interface IAsset extends ICommonModel, ICommonIconWallpaperModel {
  authority_id: number,
  
  name: string,
  description: string,
  multiple: boolean,
  active: boolean,
}