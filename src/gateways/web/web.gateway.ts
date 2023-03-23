import express from 'express';
import express_fileupload from 'express-fileupload';
import * as cookie_parser from 'cookie-parser';
import {
  RequestLoggerMiddleware,
  CsrfSetCookieMiddle,
  AppEnvironment
} from '@lib/backend-shared';
import { AppRouter } from '../routers/_app.router';



const app: express.Application = express();
app.set('trust proxy', true);



// utility middlewares
app.use(express_fileupload({ debug: true, safeFileNames: true, preserveExtension: true }));
app.use(cookie_parser.default());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// request logger/analytics middleware
app.use(RequestLoggerMiddleware);
app.use(CsrfSetCookieMiddle);

app.use(AppRouter);


/** Start Server */
app.listen(AppEnvironment.PORT, () => {
  console.log(`Listening on port ${AppEnvironment.PORT}...\n\n`);
});
