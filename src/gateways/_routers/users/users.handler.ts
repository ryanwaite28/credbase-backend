import { CatchRequestHandlerError, ExpressResponse, ServiceMethodResults } from '@lib/backend-shared';
import { UserSignUpDto, UserSignInDto, UserUpdatesDto } from '@lib/fullstack-shared';
import { Request, Response } from 'express';
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
  static async get_user_by_email(request: Request, response: Response): ExpressResponse {
    const email: string = request.params.email;
    
    const serviceMethodResults: ServiceMethodResults = await UsersService.get_user_by_email(email);
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

  @CatchRequestHandlerError()
  static async update_user(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.id);
    const dto: UserUpdatesDto = response.locals[`dto`];
    
    const serviceMethodResults: ServiceMethodResults = await UsersService.update_user(user_id, dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async delete_user(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.id);
    
    const serviceMethodResults: ServiceMethodResults = await UsersService.delete_user(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

}

