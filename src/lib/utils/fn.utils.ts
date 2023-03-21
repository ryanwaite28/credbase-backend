import {
  sign as jwt_sign,
  verify as jwt_verify
} from 'jsonwebtoken';

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

export function generateJWT(data: any, secret?: string): string | null {
  // console.log(`generateJWT:`, { data });
  try {
    const jwt_token = jwt_sign(data, secret || (<string> process.env.JWT_SECRET));
    return jwt_token || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function decodeJWT(token: any, secret?: string) {
  try {
    const data = jwt_verify(token, secret || (<string> process.env.JWT_SECRET));
    // console.log(`decodeJWT:`, { data });
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}