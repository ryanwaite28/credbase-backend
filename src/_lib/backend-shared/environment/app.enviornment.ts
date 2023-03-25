/*
  Singleton class for containing all environment variables.
  Will contain common environment variable names for common use cases such as "APP_NAME"
  and will also contain app specific keys.

  The purpose of this class is to have parsed and static typing for environment variable values and to stop the random use of `process.env` throughout the codebase.
  Every/Any environment variable should be defined and accessed here. If it is app specific, siimply create an object key for it here.
*/

import { decodeJWT, generateJWT } from "../utils/fn.utils";

 

export class AppEnvironment {
  /*
    The name of the running application.
    This value is mainly used for logging but could also used for other purposes
    such as generating object key names if needed.

    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly APP_NAME = {
    MACHINE: process.env['APP_MACHINE_NAME'],
    DISPLAY: process.env['APP_DISPLAY_NAME'],
  };

  public static readonly RABBIT_MQ_URL: string = process.env['RABBIT_MQ_URL']!;

  /*
  
  */

  public static readonly CORS = {
    WHITELIST: process.env[`CORS_WHITELIST_ORIGINS`] ? process.env[`CORS_WHITELIST_ORIGINS`].split(',') : []
  };


  /*
  
  */

  public static readonly AWS = {
    SES: {
      EMAIL: process.env[`PLATFORM_AWS_SES_EMAIL`]!,
      ARN: process.env[`PLATFORM_AWS_SES_ARN`]!,
    }
  };




  /*
    JWT Secrets

    All apps are expected to use the same value for these keys
  */

  public static readonly JWT_SECRETS = {
    USER: {
      SECRET: process.env['JWT_USER_SECRET']!,
      encode: (value: any) => generateJWT(value, process.env['JWT_USER_SECRET']!),
      decode: (value: any) => decodeJWT(value, process.env['JWT_USER_SECRET']!),
    },

    AUTHORITY: {
      SECRET: process.env['JWT_AUTHORITY_SECRET']!,
      encode: (value: any) => generateJWT(value, process.env['JWT_AUTHORITY_SECRET']!),
      decode: (value: any) => decodeJWT(value, process.env['JWT_AUTHORITY_SECRET']!),
    },
  };

 

  /*
    This is the port that the server application listens on.
    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly PORT = process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;

 

  /*
    The App current working environment.
    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly APP_ENV = process.env['APP_ENV']?.toUpperCase();

 

  /*
    A convenience for checking what the current environment is.
    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly IS_ENV = {
    LOCAL: process.env['APP_ENV']?.toUpperCase() === `LOCAL`,
    DEV: process.env['APP_ENV']?.toUpperCase() === `DEV`,
    QA: process.env['APP_ENV']?.toUpperCase() === `QA`,
    PROD: process.env['APP_ENV']?.toUpperCase() === `PROD`,
  };




  /*
    The database connection configuration.
    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly database = {
    URL: process.env['DATABASE_URL'],

    SCHEMA: process.env['DATABASE_SCHEMA'],
    USERNAME: process.env['DATABASE_USER'],
    PASSWORD: process.env['DATABASE_PASS'],
    HOST: process.env['DATABASE_HOST'],
    PORT: process.env['DATABASE_PORT'] ? parseInt(process.env['DATABASE_PORT']) : 5432,
    NAME: process.env['DATABASE_NAME'],
    PROTOCOL: process.env['DATABASE_PROTOCOL'] || `postgres`, // most FINRA apps use postgreSQL so postgres is assumed

    // a convenience property

    CONNECTION_STRING: ((): string => {
      const USER = process.env['DATABASE_USER'];
      const PASSWORD = process.env['DATABASE_PASS'];
      const HOST = process.env['DATABASE_HOST'];
      const PORT = process.env['DATABASE_PORT'] ? parseInt(process.env['DATABASE_PORT']) : 5432;
      const DATABASE = process.env['DATABASE_NAME'];
      const PROTOCOL = process.env['DATABASE_PROTOCOL'];
 
      const connectionString: string = `${PROTOCOL}://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;
      return connectionString;
    })(),
  };

}