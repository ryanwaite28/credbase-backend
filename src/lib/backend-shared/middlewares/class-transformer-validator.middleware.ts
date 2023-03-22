import { NextFunction, Request, Response } from "express";
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from "class-validator";
import { ServiceMethodResults } from "../interfaces/common.interface";
import { HttpStatusCode } from "@lib/fullstack-shared";



export function ValidateRequestBodyDto (ClassConstructor: ClassType<object>) {

  return async (request: Request, response: Response, next: NextFunction) => {
    console.log(`\n\n\n======= BEGIN ValidateRequestBodyDto Middleware =======`);

    try {
      const dataDto = await transformAndValidate(ClassConstructor, request.body);
      console.log(`dataDto:`, dataDto);
      response.locals[`dto`] = dataDto
      console.log(`======= END ValidateRequestBodyDto; NEXT =======\n\n\n`);
      return next();
    }
    catch (err) {
      // get the first validation error
      const errors: ValidationError[] = err as ValidationError[];
      const firstError = errors[0] as any;
      const errorKeys = Object.keys(firstError.constraints);
      const errorMessage: string = firstError.constraints['isNotEmpty'] || firstError.constraints[errorKeys[0]]; // check if empty first before any other errors

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: errorMessage,
          data: errors,
        }
      };
      console.error(errors);
      console.log(`======= END ValidateRequestBodyDto; NEXT =======\n\n\n`);
      return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
    }

  }

}