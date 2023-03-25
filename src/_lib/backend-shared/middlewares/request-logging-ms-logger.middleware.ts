import { NextFunction, Request, Response } from 'express';

import { MicroservicesQueues, LogsQueueMessageTypes, ContentTypes } from '@lib/fullstack-shared';
import { AppEnvironment } from '../environment/app.enviornment';
import { RabbitMQClient } from '../helpers/rabbitmq-client.helper';
import { getExpressRequestInfo } from '../utils/fn.utils';



export function SendRequestToLoggingMicroservice(rmqClient: RabbitMQClient) {
  return (request: Request, response: Response, next: NextFunction) => {
    const requestData = {
      ...getExpressRequestInfo(request),
      process_pid: process.pid,
      gateway: AppEnvironment.APP_NAME.MACHINE,
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
  }
}