// src/common/filters/validation-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      // Unprocessable Entity
      // Format validation errors
      const formattedErrors = formatValidationErrors(exceptionResponse);

      response.status(status).json({
        message: formattedErrors,
        error: 'Unprocessable Entity',
        statusCode: status,
      });
    }
  }
}

function formatValidationErrors(errors: any): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  console.log('exceptionResponse: ', errors);
  // If errors is an array of objects with constraints
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      const property = error.property;
      const constraints = error.constraints;
      if (constraints) {
        formattedErrors[property] = Object.values(constraints).join(', ');
      }
    });
  }
  // If errors is an object with field names as keys
  else if (typeof errors === 'object' && errors !== null) {
    for (const [property, messages] of Object.entries(errors)) {
      if (Array.isArray(messages)) {
        formattedErrors[property] = messages.join(', ');
      } else if (typeof messages === 'string') {
        formattedErrors[property] = messages;
      }
    }
  }
  // Handle unexpected formats
  else {
    formattedErrors['general'] = 'An unexpected error occurred.';
  }

  return formattedErrors;
}
