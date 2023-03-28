import { CatchRequestHandlerError, ExpressResponse, ServiceMethodResults } from '@lib/backend-shared';
import { LoginAuthorityDto, CreateAuthorityDto, UpdateAuthorityDto } from '@lib/fullstack-shared';
import { Request, Response } from 'express';
import { AuthoritiesService } from './authorities.service';



export class AuthoritiesRequestHandler {

  @CatchRequestHandlerError()
  static async check_session(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await AuthoritiesService.check_session(request);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_authorities(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await AuthoritiesService.get_authorities();
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_authority_by_id(request: Request, response: Response): ExpressResponse {
    const authority_id: number = parseInt(request.params.id);
    
    const serviceMethodResults: ServiceMethodResults = await AuthoritiesService.get_authority_by_id(authority_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_authority_by_email(request: Request, response: Response): ExpressResponse {
    const email: string = request.params.email;
    
    const serviceMethodResults: ServiceMethodResults = await AuthoritiesService.get_authority_by_email(email);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async sign_up(request: Request, response: Response): ExpressResponse {
    const dto: CreateAuthorityDto = response.locals[`dto`];
    const request_origin = request.get('origin')!;
    
    const serviceMethodResults: ServiceMethodResults = await AuthoritiesService.sign_up(dto, request_origin);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async sign_in(request: Request, response: Response): ExpressResponse {
    const dto: LoginAuthorityDto = response.locals[`dto`];
    
    const serviceMethodResults: ServiceMethodResults = await AuthoritiesService.sign_in(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async update_authority(request: Request, response: Response): ExpressResponse {
    const authority_id: number = parseInt(request.params.id);
    const dto: UpdateAuthorityDto = response.locals[`dto`];
    
    const serviceMethodResults: ServiceMethodResults = await AuthoritiesService.update_authority(authority_id, dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async delete_authority(request: Request, response: Response): ExpressResponse {
    const authority_id: number = parseInt(request.params.id);
    
    const serviceMethodResults: ServiceMethodResults = await AuthoritiesService.delete_authority(authority_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

}

