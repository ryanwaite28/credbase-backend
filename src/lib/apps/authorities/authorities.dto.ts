import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import {
  PASSWORD_REGEX,
} from '../../regex/common.regex';


export class CreateAuthorityDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEmail()
  support_email: string;

  @IsNotEmpty()
  @IsUrl()
  business_website: string;

  @IsNotEmpty()
  @IsUrl()
  support_website: string;
}

export class LoginAuthorityDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  password: string;
}

export class UpdateAuthorityDto {
  @IsOptional()
  @IsEmail()
  email: string;
  
  @IsOptional()
  @Matches(PASSWORD_REGEX)
  currentPassword: string;

  @IsOptional()
  @Matches(PASSWORD_REGEX)
  newPassword: string;

  @IsOptional()
  @Matches(PASSWORD_REGEX)
  confirmPassword: string;
  
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  description: string;
  
  @IsOptional()
  @IsEmail()
  support_email: string | null;
  
  @IsOptional()
  @IsUrl()
  business_website: string | null;
  
  @IsOptional()
  @IsUrl()
  support_website: string | null;

  @IsOptional()
  @IsString()
  street_address: string | null;
  
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
  
  @IsOptional()
  @IsPhoneNumber()
  phone: string | null;
  
  @IsOptional()
  @IsPhoneNumber()
  temp_phone: string | null;

  @IsOptional()
  @IsString()
  icon_link: string | null;
  
  @IsOptional()
  @IsString()
  icon_id: string | null;
  
  @IsOptional()
  @IsString()
  wallpaper_link: string | null;
  
  @IsOptional()
  @IsString()
  wallpaper_id: string | null;

  @IsOptional()
  @IsBoolean()
  account_verified: boolean;
  
  @IsOptional()
  @IsBoolean()
  email_verified: boolean;
  
  @IsOptional()
  @IsBoolean()
  phone_verified: boolean;
}