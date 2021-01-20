import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorObj = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception._message ? exception._message : exception.message,
            error: exception.errors ? exception.errors : exception.response
        }
        Logger.error(`Below text is Server error ==> `, JSON.stringify(errorObj))
        response.status(status).json(errorObj);
    }
}