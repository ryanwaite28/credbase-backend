import { NextFunction, Request, Response } from 'express';
import { AuthResults } from '../interfaces/common.interface';

export type ContentType = 'application/json' | 'application/octet-stream' | 'text/plain' | null;

export type AuthRequestCurry = (request: Request, checkUrlYouIdMatch?: boolean) => AuthResults;

export type ExpressMiddlewareFn = (
  request: Request, 
  response: Response, 
  next: NextFunction
) => void | Response<any> | Promise<void | Response<any>>;

export type ExpressResponse = Promise<Response<any>>;

export type ExpressRouteEndHandler = (
  request: Request, 
  response: Response
) => ExpressResponse;