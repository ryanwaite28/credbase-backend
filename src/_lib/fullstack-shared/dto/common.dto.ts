import { IsInt, IsOptional, IsString } from "class-validator";




export class IconDto {
  @IsOptional()
  @IsString()
  icon_bucket?: string | null;
  
  @IsOptional()
  @IsString()
  icon_path_key?: string | null;
  
  @IsOptional()
  @IsString()
  icon_link?: string | null;
}

export class WallpaperDto {
  @IsOptional()
  @IsString()
  wallpaper_bucket?: string | null;
  
  @IsOptional()
  @IsString()
  wallpaper_path_key?: string | null;
  
  @IsOptional()
  @IsString()
  wallpaper_link?: string | null;
}


export class IconWallpaperDto {
  @IsOptional()
  @IsString()
  icon_bucket?: string | null;
  
  @IsOptional()
  @IsString()
  icon_path_key?: string | null;
  
  @IsOptional()
  @IsString()
  icon_link?: string | null;


  @IsOptional()
  @IsString()
  wallpaper_bucket?: string | null;
  
  @IsOptional()
  @IsString()
  wallpaper_path_key?: string | null;
  
  @IsOptional()
  @IsString()
  wallpaper_link?: string | null;
}


export class LocationDto {
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
  zipcode?: number | null;
}