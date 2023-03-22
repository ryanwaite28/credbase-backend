import { Router } from 'express';
import { UsersRouter } from './users/users.router';


export const AppRouter: Router = Router({ mergeParams: true });

AppRouter.use('/users', UsersRouter);
