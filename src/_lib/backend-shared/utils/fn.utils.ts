import { Request } from 'express';
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

export function getExpressRequestInfo(request: Request) {
  return {
    accepted: request.accepted,
    url: request.url,
    baseUrl: request.baseUrl,
    path: request.path,
    originalUrl: request.originalUrl,
    protocol: request.protocol,
    secure: request.secure,
    route: request.route,
    hostname: request.hostname || request.host,
    httpVersion: request.httpVersion,
    ip: request.ip,
    ips: request.ips,
    origin: request.get('origin'),
    method: request.method,
    body: request.body,
    headers: request.headers,
    raw_headers: request.rawHeaders,
    cookies: request.cookies,
    device: JSON.stringify(request['device']),
    params: request.params,
    query: request.query,
    signed_cookies: request.signedCookies,
    subdomains: request.subdomains,
    xhr: request.xhr,
  };
}