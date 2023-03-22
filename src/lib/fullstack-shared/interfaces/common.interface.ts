export interface MapType<T = any> { [key:string]: T }



export interface ICommonModel extends MapType {
  id: number,
  uuid: string,
  metadata: string,
  created_at: string,
  updated_at: string,
  deleted_at: string,
}

export interface ICommonIconModel extends MapType {
  icon_bucket: string | null,
  icon_path_key: string | null,
  icon_link: string | null,
}

export interface ICommonWallpaperModel extends MapType {
  wallpaper_bucket: string | null,
  wallpaper_path_key: string | null,
  wallpaper_link: string | null,
}

export interface ICommonIconWallpaperModel extends ICommonIconModel, ICommonWallpaperModel {}

