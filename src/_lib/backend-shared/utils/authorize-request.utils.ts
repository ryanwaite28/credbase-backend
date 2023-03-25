import { AUTH_BEARER_HEADER_REGEX, HttpStatusCode } from '@lib/fullstack-shared';
import {
  Request,
  Response,
  NextFunction
} from 'express';
import { AuthRequestCurry, ExpressMiddlewareFn } from '../types/common.type';
import { decodeJWT } from './fn.utils';




export type JwtAuthorizer = (
  secret: string,
  model: string
) => AuthRequestCurry;


export const AuthorizeJwtGuard: JwtAuthorizer = (
  secret: string,
  model: string
) => {
  const fn: AuthRequestCurry = (request: Request, checkUrlYouIdMatch?: boolean) => {
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

export function CreateJwtAuthGuard(authorizer: AuthRequestCurry): ExpressMiddlewareFn {
  return (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const auth = authorizer(request, true);
    if (auth.error) {
      return response.status(auth.status).json(auth);
    }
    response.locals.user = auth['user'];
    return next();
  } 
}