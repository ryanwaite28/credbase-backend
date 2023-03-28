import {
  ValidateRequestBodyDto
} from '@lib/backend-shared';
import { AuthorityAuthorizedGuard } from '@lib/backend-shared/express-guards/authorizations.guard';
import { CreateAuthorityDto, LoginAuthorityDto, UpdateAuthorityDto } from '@lib/fullstack-shared';
import { Router } from 'express';
import { AuthoritiesRequestHandler } from './authorities.handler';


export const AuthoritiesRouter: Router = Router({ mergeParams: true });



// GET

AuthoritiesRouter.get('/check-session', AuthoritiesRequestHandler.check_session);

AuthoritiesRouter.get('/', AuthoritiesRequestHandler.get_authorities);

AuthoritiesRouter.get('/email/:email', AuthoritiesRequestHandler.get_authority_by_email);

AuthoritiesRouter.get('/:id', AuthoritiesRequestHandler.get_authority_by_id);



// POST
AuthoritiesRouter.post('/', ValidateRequestBodyDto(CreateAuthorityDto), AuthoritiesRequestHandler.sign_up);



// PUT
AuthoritiesRouter.put('/:id', AuthorityAuthorizedGuard, ValidateRequestBodyDto(UpdateAuthorityDto), AuthoritiesRequestHandler.update_authority);

AuthoritiesRouter.put('/', ValidateRequestBodyDto(LoginAuthorityDto), AuthoritiesRequestHandler.sign_in);



// DELETE
// AuthoritiesRouter.delete('/:id', AuthorityAuthorizedGuard, AuthoritiesRequestHandler.delete_authority);