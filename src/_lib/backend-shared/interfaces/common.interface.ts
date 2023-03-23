import { HttpStatusCode } from "@lib/fullstack-shared";


export interface AuthResults {
  error: boolean;
  status: HttpStatusCode;
  message: string;
  [key:string]: any,
}


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