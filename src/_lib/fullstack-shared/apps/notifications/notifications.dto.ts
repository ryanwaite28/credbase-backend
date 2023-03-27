import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt
} from 'class-validator';



export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  event: string;
  
  @IsOptional()
  @IsString()
  from_model_type: string;
  
  @IsOptional()
  @IsInt()
  from_model_id: number;
  
  @IsNotEmpty()
  @IsString()
  target_type: string;
  
  @IsNotEmpty()
  @IsInt()
  target_id: number;
}

export class CreateUserNotificationDto extends CreateNotificationDto {
  @IsNotEmpty()
  @IsInt()
  for_user_id: number;
}

export class CreateAuthorityNotificationDto extends CreateNotificationDto {
  @IsNotEmpty()
  @IsInt()
  for_authority_id: number;
}