import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  IsEnum
} from 'class-validator';
import {
  PERSON_NAME_REGEX,
} from '../../regex/common.regex';
import { PASSWORD_REGEX } from './users.regex';


export class UserSignUpDto {
  @IsNotEmpty()
  @Matches(PERSON_NAME_REGEX)
  firstname: string;
  
  @IsNotEmpty()
  @Matches(PERSON_NAME_REGEX)
  lastname: string;

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

export class UserUpdatesDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  currentPassword: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  newPassword: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  confirmPassword: string;
}