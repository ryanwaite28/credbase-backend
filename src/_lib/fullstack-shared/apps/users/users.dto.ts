import { IconWallpaperDto } from '@lib/fullstack-shared/dto/common.dto';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import {
  PASSWORD_REGEX,
  PERSON_NAME_REGEX,
} from '../../regex/common.regex';


export class UserSignUpDto {
  @IsNotEmpty()
  @Matches(PERSON_NAME_REGEX)
  firstname: string;

  @IsOptional()
  @Matches(PERSON_NAME_REGEX)
  middlename?: string | null;
  
  @IsNotEmpty()
  @Matches(PERSON_NAME_REGEX)
  lastname: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string | null;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  password: string;
}

export class UserSignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  password: string;
}

export class UserUpdatesDto extends IconWallpaperDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(PASSWORD_REGEX)
  currentPassword?: string;

  @IsOptional()
  @Matches(PASSWORD_REGEX)
  newPassword?: string;

  @IsOptional()
  @Matches(PASSWORD_REGEX)
  confirmPassword?: string;
  
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsPhoneNumber()
  temp_phone?: string;

  @IsOptional()
  @IsString()
  city: string | null;
  
  @IsOptional()
  @IsString()
  state: string | null;
  
  @IsOptional()
  @IsString()
  country: string | null;
  
  @IsOptional()
  @IsInt()
  zipcode: number | null;
  
  // @IsOptional()
  // @IsString()
  // stripe_customer_account_id?: string;

  // @IsOptional()
  // @IsString()
  // stripe_account_id?: string;

  // @IsOptional()
  // @IsBoolean()
  // stripe_account_verified: boolean;

  // @IsOptional()
  // @IsString()
  // platform_subscription_id?: string;

  // @IsOptional()
  // @IsString()
  // icon_link?: string;

  // @IsOptional()
  // @IsString()
  // icon_id?: string;

  // @IsOptional()
  // @IsString()
  // wallpaper_link?: string;

  // @IsOptional()
  // @IsString()
  // wallpaper_id?: string;

  // @IsOptional()
  // @IsString()
  // id_card_front_link?: string;

  // @IsOptional()
  // @IsString()
  // id_card_front_id?: string;

  // @IsOptional()
  // @IsString()
  // id_card_back_link?: string;

  // @IsOptional()
  // @IsString()
  // id_card_back_id?: string;

  @IsOptional()
  @IsBoolean()
  person_verified?: boolean;

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;
  
  @IsOptional()
  @IsBoolean()
  phone_verified?: boolean;
}