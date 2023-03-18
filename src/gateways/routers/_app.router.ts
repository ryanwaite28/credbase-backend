import { Router } from 'express';
import { UsersRouter } from './users/users.router';
import { MicroservicesQueues, UsersQueueMessageTypes, ContentTypes, ServiceMethodAsyncResults } from '@lib/shared';
import { rmqClient } from './users/users.rmq';
import { UploadedFile } from 'express-fileupload';


export const AppRouter: Router = Router({ mergeParams: true });

AppRouter.use('/users', UsersRouter);
