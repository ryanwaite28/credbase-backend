import { ICommonIconWallpaperModel, ICommonModel } from "../../interfaces/common.interface";



export interface IAuthority extends ICommonModel, ICommonIconWallpaperModel {
  email: string,
  password?: string,
  
  name: string,
  description: string,
  industry: string | null,
  support_email: string | null,
  business_website: string | null,
  support_website: string | null,

  street_address: string | null,
  city: string | null,
  state: string | null,
  country: string | null,
  zipcode: number | null,
  
  phone: string | null,
  temp_phone: string | null,

  account_verified: boolean,
  email_verified: boolean,
  phone_verified: boolean,
}