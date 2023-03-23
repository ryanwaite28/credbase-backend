import {
  sign as jwt_sign,
  verify as jwt_verify
} from 'jsonwebtoken';

export function generateJWT(data: any, secret: string): string | null {
  // console.log(`generateJWT:`, { data });
  try {
    const jwt_token = jwt_sign(data, secret);
    return jwt_token || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function decodeJWT(token: any, secret: string) {
  try {
    const data = jwt_verify(token, secret);
    // console.log(`decodeJWT:`, { data });
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}