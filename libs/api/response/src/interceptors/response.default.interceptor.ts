import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
    ResponseDefaultSerialization,
    ResponseMetadataSerialization,
} from "../serializations/response.default.serializatiion";
import {
    RESPONSE_SERIALIZATION_META_KEY,
    RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from "../constants/response.constants";
import { ClassConstructor, ClassTransformOptions, plainToInstance } from "class-transformer";
import { IResponse } from "../interfaces/response.interface";

@Injectable()
export class ResponseDefaultInterceptor<T = ResponseDefaultSerialization>
    implements NestInterceptor<Promise<T>>
{
    constructor(private readonly reflector: Reflector) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler<Promise<T>>
    ): Promise<Observable<Promise<T>>> {
        if (context.getType() === "http") {
            return next.handle().pipe(
                map(async (res: Promise<T>) => {
                    const ctx = context.switchToHttp();
                    const response = ctx.getResponse();

                    const classSerialization = this.reflector.get<ClassConstructor<any>>(
                        RESPONSE_SERIALIZATION_META_KEY,
                        context.getHandler()
                    );
                    const classSerializationOptions = this.reflector.get<ClassTransformOptions>(
                        RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
                        context.getHandler()
                    );

                    // Set default response
                    let httpStatus: HttpStatus = response.statusCode;
                    let statusCode: number = response.statusCode;
                    let data: Record<string, any> | undefined = undefined;
                    let metadata: ResponseMetadataSerialization | undefined = {};

                    // response
                    const responseData = (await res) as IResponse;

                    if (responseData) {
                        const { _metadata } = responseData;
                        data = responseData.data;

                        if (data && classSerialization) {
                            data = plainToInstance(
                                classSerialization,
                                data,
                                classSerializationOptions
                            );
                        }

                        httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
                        statusCode = _metadata?.customProperty?.statusCode ?? statusCode;

                        delete _metadata?.customProperty;

                        metadata = {
                            ...metadata,
                            ..._metadata,
                        };
                    }

                    response.status(httpStatus);
                    return {
                        statusCode,
                        _metadata: metadata,
                        data,
                    } as T;
                })
            );
        }
        return next.handle();
    }
}
