import { NextFunction, Request, Response } from "express";
import moment from 'moment';
import { getExpressRequestInfo } from "../utils/fn.utils";

export function RequestLoggerMiddleware(request: Request, response: Response, next: NextFunction) {
  console.log(`\n\n\n======= BEGIN RequestLoggerMiddleware =======`);
  console.log(`\n${moment().format('dddd, MMMM Do YYYY, h:mm:ss A')}\n`);
  console.log(getExpressRequestInfo(request));
  console.log(`======= END RequestLoggerMiddleware; NEXT =======\n\n\n`);

  return next();
}