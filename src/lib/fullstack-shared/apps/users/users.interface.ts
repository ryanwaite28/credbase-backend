import { ICommonIconWallpaperModel, ICommonModel } from "../../interfaces/common.interface";




export interface IUser extends ICommonModel, ICommonIconWallpaperModel {
  firstname: string,
  lastname: string,
  email: string,
  password?: string,
  
  phone: string | null,
  temp_phone: string | null,

  person_verified: boolean,
  email_verified: boolean,
  phone_verified: boolean,
}