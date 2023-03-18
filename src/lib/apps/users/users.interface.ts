import { ICommonModel } from "../../interfaces/models.interface";



export interface IUser extends ICommonModel {
  firstname: string,
  lastname: string,
  email: string,
  
  phone: string | null,
  temp_phone: string | null,
  stripe_customer_account_id: string | null,
  stripe_account_id: string | null,
  stripe_account_verified: boolean,
  platform_subscription_id: string | null,

  icon_link: string,
  icon_id: string,
  wallpaper_link: string,
  wallpaper_id: string,

  id_card_front_link: string,
  id_card_front_id: string,
  id_card_back_link: string,
  id_card_back_id: string,

  person_verified: boolean,
  email_verified: boolean,
  phone_verified: boolean,
}