import express, { Request, Response } from 'express';
import { join } from 'path';
import { Server as io_server } from "socket.io";
import { createServer, Server } from 'http';
import express_fileupload from 'express-fileupload';
import * as cookie_parser from 'cookie-parser';
import {
  RequestLoggerMiddleware,
  CsrfSetCookieMiddle
} from '@lib/shared';
import { AppRouter } from '../routers/_app.router';



const PORT: string | number = process.env.PORT || 80;
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
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...\n\n`);
});
