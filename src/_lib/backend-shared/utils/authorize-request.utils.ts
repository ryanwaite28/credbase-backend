import { AUTH_BEARER_HEADER_REGEX, HttpStatusCode } from '@lib/fullstack-shared';
import {
  Request,
} from 'express';
import { AuthRequestCurry } from '../types/common.type';
import { decodeJWT } from './fn.utils';





export function AuthorizeJwtGuard(
  secret: string,
  model: string
): AuthRequestCurry {
  const fn: AuthRequestCurry = (request: Request, checkUrlYouIdMatch: boolean) => {
    try {
      /* First, check Authorization header */
      const auth = request.get('Authorization');
      if (!auth) {
        return {
          error: true,
          status: HttpStatusCode.UNAUTHORIZED,
          message: `Request not authorized: missing Authorization header`
        };
      }
      const isNotBearerFormat = !AUTH_BEARER_HEADER_REGEX.test(auth);
      if (isNotBearerFormat) {
        return {
          error: true,
          status: HttpStatusCode.UNAUTHORIZED,
          message: `Request not authorized: Authorization header must be Bearer format`
        };
      }
  
      /* Check token validity */
      const token = auth.split(' ')[1];
      let data;
      try {
        data = decodeJWT(token, secret) || null;
      } catch (e) {
        console.log(e);
        data = null;
      }
      if (!data) {
        return {
          error: true,
          status: HttpStatusCode.UNAUTHORIZED,
          message: `Request not authorized: invalid token`
        };
      }
  
      /* Request is okay */
      return {
        error: false,
        status: HttpStatusCode.OK,
        message: `user authorized`,
        [model]: data,
      };
    } catch (error) {
      console.log(`auth jwt error:`, error);
      return {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: `Request auth failed...`
      };
    }
  }

  return fn;
}