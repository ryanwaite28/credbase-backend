import express, { NextFunction, Request, Response } from 'express';
import express_fileupload from 'express-fileupload';
import * as cookie_parser from 'cookie-parser';
import {
  RequestLoggerMiddleware,
  CsrfSetCookieMiddle,
  AppEnvironment
} from '@lib/backend-shared';
import { AppRouter } from '../routers/_app.router';
import { rmqClient } from './web.rmq';
import { ContentTypes, LogsQueueMessageTypes, MicroservicesQueues } from '@lib/fullstack-shared';



const app: express.Application = express();
app.set('trust proxy', true);



// utility middlewares
app.use(express_fileupload({ debug: true, safeFileNames: true, preserveExtension: true }));
app.use(cookie_parser.default());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// request logger/analytics middleware
app.use(RequestLoggerMiddleware);
app.use(function SendRequestToLoggingMicroservice(request: Request, response: Response, next: NextFunction) {
  const requestData = {
    url: request.url,
    method: request.method,
    body: request.body,
    headers: request.headers,
    raw_headers: request.rawHeaders,
    cookies: request.cookies,
    device: JSON.stringify(request['device']),
    params: request.params,
    query: request.query,
    signed_cookies: request.signedCookies,
  };

  rmqClient.sendMessage({
    queue: MicroservicesQueues.LOGGING,
    data: requestData,
    publishOptions: {
      type: LogsQueueMessageTypes.WEB_GATEWAY_REQUEST,
      contentType: ContentTypes.JSON,
      correlationId: Date.now().toString(),
    }
  });

  next();
});
app.use(CsrfSetCookieMiddle);

app.use(AppRouter);


/** Start Server */

rmqClient.onReady.subscribe({
  next: () => {
    app.listen(AppEnvironment.PORT, () => {
      console.log(`Listening on port ${AppEnvironment.PORT}...\n\n`);
    });
  }
});
