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



export class CreateAssetDto {
  @IsNotEmpty()
  @IsInt()
  authority_id: number;
  
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsString()
  description: string;
  
  @IsOptional()
  @IsBoolean()
  multiple?: boolean;
}



export class UpdateAssetDto {
  @IsOptional()
  @IsBoolean()
  name: string;
  
  @IsOptional()
  @IsBoolean()
  description: string;
  
  @IsOptional()
  @IsBoolean()
  multiple: boolean;
  
  @IsOptional()
  @IsBoolean()
  active: boolean;
}
