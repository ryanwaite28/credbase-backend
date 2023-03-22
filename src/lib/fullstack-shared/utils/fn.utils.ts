import { MapType } from "../interfaces/common.interface";

export const mapify = <T> (list: T[], key: string | number): MapType<T> => {
  return list.reduce((map: MapType<T>, item: T) => {
    map[ item[key] ] = item;
    return map;
  }, {} as MapType<T>);
};

export const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};