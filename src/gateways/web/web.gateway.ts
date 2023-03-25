import express from 'express';
import express_fileupload from 'express-fileupload';
import * as cookie_parser from 'cookie-parser';

import {
  RequestLoggerMiddleware,
  CsrfSetCookieMiddle,
  AppEnvironment,
  SendRequestToLoggingMicroservice,
  WebCsrfAuthGuard
} from '@lib/backend-shared';

import { AppRouter } from '../_routers/_app.router';
import { rmqClient } from './web.rmq';



const app: express.Application = express();
app.set('trust proxy', true);



// utility middlewares
app.use(express_fileupload({ debug: true, safeFileNames: true, preserveExtension: true }));
app.use(cookie_parser.default());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(RequestLoggerMiddleware);
app.use(SendRequestToLoggingMicroservice(rmqClient));
app.use(CsrfSetCookieMiddle);
app.use(WebCsrfAuthGuard);



// mount application router
app.use(AppRouter);



/** Start Server */

rmqClient.onReady.subscribe({
  next: () => {
    app.listen(AppEnvironment.PORT, () => {
      console.log(`Listening on port ${AppEnvironment.PORT}...\n\n`);
    });
  }
});
