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
  MinLength,
  ValidateNested,
} from 'class-validator';




export class ItemFieldDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  type?: string;
  
  @IsOptional()
  @ValidateNested()
  fields?: ItemFieldDto[]
}

export class CreateItemDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  asset_id: number;
  
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @IsOptional()
  @IsString()
  description: string;
  
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @MinLength(1)
  fields: ItemFieldDto[]
}
