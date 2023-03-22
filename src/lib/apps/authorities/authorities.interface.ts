import { ICommonModel } from "../../interfaces/models.interface";

export interface IAuthority extends ICommonModel {
  email: string,
  password?: string,
  
  name: string,
  description: string,
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

  icon_link: string | null,
  icon_id: string | null,
  wallpaper_link: string | null,
  wallpaper_id: string | null,

  account_verified: boolean,
  email_verified: boolean,
  phone_verified: boolean,
}