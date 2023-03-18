import { Request, Response } from 'express';
import {
  CatchRequestHandlerError,
  ExpressResponse,
  ServiceMethodResults,
  UserSignUpDto,
  UserSignInDto
} from '@lib/shared';
import { UsersService } from './users.service';



export class UsersRequestHandler {

  @CatchRequestHandlerError()
  static async get_users(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await UsersService.get_users();
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_user_by_id(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.id);
    
    const serviceMethodResults: ServiceMethodResults = await UsersService.get_user_by_id(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async sign_up(request: Request, response: Response): ExpressResponse {
    const dto: UserSignUpDto = response.locals[`dto`];
    const request_origin = request.get('origin')!;
    
    const serviceMethodResults: ServiceMethodResults = await UsersService.sign_up(dto, request_origin);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async sign_in(request: Request, response: Response): ExpressResponse {
    const dto: UserSignInDto = response.locals[`dto`];
    
    const serviceMethodResults: ServiceMethodResults = await UsersService.sign_in(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

}

