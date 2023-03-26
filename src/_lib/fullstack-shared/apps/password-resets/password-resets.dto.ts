import { IsInt, IsNotEmpty, IsString } from "class-validator";



export class CreateUserPasswordResetDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;
  
  @IsNotEmpty()
  @IsString()
  user_email: number;
}

export class CreateAuthorityPasswordResetDto {
  @IsNotEmpty()
  @IsInt()
  authority_id: number;
  
  @IsNotEmpty()
  @IsString()
  authority_email: number;
}