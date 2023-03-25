import {
  ValidateRequestBodyDto
} from '@lib/backend-shared';
import { UserAuthorizedGuard } from '@lib/backend-shared/express-guards/authorizations.guard';
import { UserSignInDto, UserSignUpDto, UserUpdatesDto } from '@lib/fullstack-shared';
import { Router } from 'express';
import { UsersRequestHandler } from './users.handler';


export const UsersRouter: Router = Router({ mergeParams: true });



// GET
UsersRouter.get('/', UsersRequestHandler.get_users);

UsersRouter.get('/email/:email', UsersRequestHandler.get_user_by_email);

UsersRouter.get('/:id', UsersRequestHandler.get_user_by_id);



// POST
UsersRouter.post('/', UserAuthorizedGuard, ValidateRequestBodyDto(UserSignUpDto), UsersRequestHandler.sign_up);



// PUT
UsersRouter.put('/:id', UserAuthorizedGuard, ValidateRequestBodyDto(UserUpdatesDto), UsersRequestHandler.update_user);

UsersRouter.put('/', UserAuthorizedGuard, ValidateRequestBodyDto(UserSignInDto), UsersRequestHandler.sign_in);



// DELETE
UsersRouter.delete('/:id', UserAuthorizedGuard, UsersRequestHandler.delete_user);