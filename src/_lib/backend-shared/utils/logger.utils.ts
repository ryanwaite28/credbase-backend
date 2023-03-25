import {
  createLogger,
  format,
  transports,
} from 'winston';
import { SPLAT } from 'triple-beam';



const myFormat = format.printf((params) => {
  const { level, message, label, timestamp } = params;
  console.log(params, params[SPLAT]);
  return `${timestamp} [${label}] ${level}: ${message} - ${params}`;
});

export const LOGGER = createLogger({
  transports: [
    new transports.File({
      filename: 'logs/combined.log',
      format: format.combine(
        format.json(),
        format.timestamp(),
      )
    }),
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.label({ label: 'DEV' }),
        format.timestamp(),
        format.splat(),
        format.colorize({
          colors: {
            info: 'white',
            debug: 'blue',
            warn: 'yellow',
            error: 'red',
          }
        }),
        myFormat
      )
    })
  ],
});
