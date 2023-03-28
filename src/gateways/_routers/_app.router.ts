import { HttpStatusCode } from '@lib/fullstack-shared';
import { Request, Response, Router } from 'express';
import { AuthoritiesRouter } from './authorities/authorities.router';
import { UsersRouter } from './users/users.router';


export const AppRouter: Router = Router({ mergeParams: true });

AppRouter.get('/csrf-token', (request: Request, response: Response) => {
  return response.status(HttpStatusCode.OK).json({
    message: 'admit one'
  });
});



AppRouter.use('/users', UsersRouter);
AppRouter.use('/authorities', AuthoritiesRouter);
