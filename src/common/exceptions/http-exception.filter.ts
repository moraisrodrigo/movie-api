import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
 
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let result: object = {};

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      result = exception.getResponse() as object;
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      result = { status, message: this.buildValidationErrorMessage(exception) }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      result = { status, message: 'Internal Server Error' }
    }
 
    response.status(status).json({
      ...result,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private buildValidationErrorMessage(exception: ValidationError): string {
    const errors = exception.constraints;
    const errorMessage = Object.values(errors).join(', ');
    return errorMessage;
  }
}