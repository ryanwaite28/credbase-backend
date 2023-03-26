import express from 'express';
import express_fileupload, { UploadedFile } from 'express-fileupload';
import * as cookie_parser from 'cookie-parser';

import {
  RequestLoggerMiddleware,
  CsrfSetCookieMiddle,
  AppEnvironment,
  SendRequestToLoggingMicroservice,
  WebCsrfAuthGuard,
  corsWebMiddleware,
} from '@lib/backend-shared';

import { AppRouter } from '../_routers/_app.router';
import { rmqClient } from './web.rmq';
import { MicroservicesQueues, UsersQueueMessageTypes, ContentTypes, GatewayEndpointPrefixes } from '@lib/fullstack-shared';



const app: express.Application = express();
app.set('trust proxy', true);



// utility middlewares
app.use(express_fileupload({ debug: false, safeFileNames: true, preserveExtension: true }));
app.use(cookie_parser.default());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(RequestLoggerMiddleware);
app.use(SendRequestToLoggingMicroservice(rmqClient));
app.use(CsrfSetCookieMiddle);
app.use(WebCsrfAuthGuard);

app.options(`*`, corsWebMiddleware);
app.use(corsWebMiddleware);



// mount application router
app.use(GatewayEndpointPrefixes.WEB, AppRouter);





/** Start Server */

rmqClient.onReady.subscribe({
  next: () => {
    app.listen(AppEnvironment.PORT, () => {
      console.log(`Listening on port ${AppEnvironment.PORT}...\n\n`);
    });
  }
});
