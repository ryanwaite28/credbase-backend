import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";
import { Models } from "../../enums/microservices/_microservices.enum";



export class CreateS3ObjectDto {
  @IsOptional()
  @IsEnum(Models)
  model_type: Models | null;
  
  @IsOptional()
  @IsInt()
  model_id: string | null;
  
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  description: string;
  
  @IsOptional()
  @IsString()
  extension: string;

  @IsOptional()
  @IsString()
  mimetype: string;
  
  @IsOptional()
  @IsInt()
  size: number;
}

export class GetS3ObjectDto {
  @IsNotEmpty()
  @IsString()
  bucket: string;
  
  @IsNotEmpty()
  @IsString()
  path_key: string;
}