import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from "../enums/http-codes.enum";



export interface MapType<T = any> { [key:string]: T }


export interface IPositionStackLocationData {
  latitude: number,
  longitude: number,
  label: string,
  name: string,
  type: string,
  number: string,
  street: string,
  postal_code: string,
  confidence: string,
  region: string,
  region_code: string,
  administrative_area: string,
  neighbourhood: string,
  country: string,
  country_code: string,
  map_url: string,
}




/**
 * @description 
 * Interface for validating data from requests
 */
 export interface IModelValidator {
  field: string,
  name: string,
  errorMessage?: string,
  
  optional?: boolean,
  defaultValue?: any,
  validator: (arg: any) => boolean,
}

export interface ServiceMethodResultsInfo<T = any> {
  message?: string;
  data?: T;
  error?: any;
};

/**
 * @interface ServiceMethodResults
 * 
 * @description
 * Interface for a service method return value.
 * - status: uses an http code to signify result of action
 * - error: flag to indicate if there was an error
 * - info: object that serves as details about the results
 */
export type ServiceMethodResults<T = any> = {
  status: HttpStatusCode,
  error: boolean,
  info: ServiceMethodResultsInfo<T>,
};

export type ServiceMethodAsyncResults<T = any> = Promise<ServiceMethodResults<T>>;

export type ModelValidators = IModelValidator[];


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

