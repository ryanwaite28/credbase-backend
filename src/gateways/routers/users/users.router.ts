import { UserSignInDto, UserSignUpDto, ValidateRequestBodyDto } from '@lib/shared';
import { Router } from 'express';
import { UsersRequestHandler } from './users.handler';


export const UsersRouter: Router = Router({ mergeParams: true });



// GET
UsersRouter.get('/', UsersRequestHandler.get_users);

UsersRouter.get('/:id', UsersRequestHandler.get_user_by_id);



// POST
UsersRouter.post('/', ValidateRequestBodyDto(UserSignUpDto), UsersRequestHandler.sign_up);



// PUT
UsersRouter.put('/', ValidateRequestBodyDto(UserSignInDto), UsersRequestHandler.sign_in);