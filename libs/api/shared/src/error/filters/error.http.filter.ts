import { Response } from "express";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IErrorException } from "../interfaces/error.interface";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse();

        // Set default
        let httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "";
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let data: Record<string, any> | undefined = undefined;

        if (exception instanceof HttpException) {
            // Restructure
            const responseException = exception.getResponse();
            httpStatus = exception.getStatus();
            statusCode = exception.getStatus();

            if (this.isErrorException(responseException)) {
                statusCode = responseException.statusCode;
                message = responseException.message;
                data = responseException.data;
            }
        }

        const responseBody = {
            statusCode,
            message,
            data,
        };

        response.status(httpStatus).json(responseBody);

        return;
    }

    isErrorException(obj: any): obj is IErrorException {
        return typeof obj === "object" ? "statusCode" in obj && "message" in obj : false;
    }
}
