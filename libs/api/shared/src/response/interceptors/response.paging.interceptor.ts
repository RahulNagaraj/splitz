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
    ResponsePaginationCursorSerialization,
    ResponsePagingMetadataSerialization,
    ResponsePagingSerialization,
} from "../serializations/response.paging.serialization";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { ClassConstructor, ClassTransformOptions, plainToInstance } from "class-transformer";
import {
    RESPONSE_SERIALIZATION_META_KEY,
    RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from "../constants/response.constants";
import { IResponsePaging } from "../interfaces/response.interface";
import * as qs from "qs";
import { IRequestApp } from "../../request/interfaces/request.interface";
import {
    PAGINATION_PAGE,
    PAGINATION_PER_PAGE,
} from "../../pagination/constants/pagination.constants";

@Injectable()
export class ResponsePagingInterceptor<T = ResponsePagingSerialization>
    implements NestInterceptor<T>
{
    constructor(private readonly reflector: Reflector) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Promise<T>>> {
        if (context.getType() === "http") {
            return next.handle().pipe(
                map(async (res: Promise<T>) => {
                    const ctx: HttpArgumentsHost = context.switchToHttp();
                    const response = ctx.getResponse();
                    const request: IRequestApp = ctx.getRequest<IRequestApp>();

                    const classSerialization: ClassConstructor<any> = this.reflector.get<
                        ClassConstructor<any>
                    >(RESPONSE_SERIALIZATION_META_KEY, context.getHandler());
                    const classSerializationOptions: ClassTransformOptions =
                        this.reflector.get<ClassTransformOptions>(
                            RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
                            context.getHandler()
                        );

                    const __path = request.url;
                    const __pagination = request.__pagination;

                    let httpStatus: HttpStatus = response.statusCode;
                    let statusCode: number = response.statusCode;
                    let data: Record<string, any>[] = [];
                    let metadata: ResponsePagingMetadataSerialization = {};

                    // response
                    const responseData = (await res) as IResponsePaging;
                    if (!responseData) {
                        throw new Error("Paging must have response");
                    }

                    const { _metadata } = responseData;
                    data = responseData.data;

                    if (classSerialization) {
                        data = plainToInstance(classSerialization, data, classSerializationOptions);
                    }

                    httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
                    statusCode = _metadata?.customProperty?.statusCode ?? statusCode;

                    delete _metadata?.customProperty;

                    // metadata pagination

                    const { query } = request;

                    delete query["perPage"];

                    delete query["page"];

                    const total: number = responseData._pagination.total;

                    const totalPage: number = responseData._pagination.totalPage;

                    const perPage: number = __pagination?.perPage ?? PAGINATION_PER_PAGE;
                    const page: number = __pagination?.page ?? PAGINATION_PAGE;

                    const queryString = qs.stringify(query, {
                        encode: false,
                        skipNulls: true,
                        strictNullHandling: true,
                    });

                    const cursorPaginationMetadata: ResponsePaginationCursorSerialization = {
                        nextPage:
                            page < totalPage
                                ? `${__path}?perPage=${perPage}&page=${page + 1}${
                                      queryString ? "&queryString" : ""
                                  }`
                                : undefined,
                        previousPage:
                            page > 1
                                ? `${__path}?perPage=${perPage}&page=${page - 1}${
                                      queryString ? "&queryString" : ""
                                  }`
                                : undefined,
                        firstPage:
                            totalPage > 1
                                ? `${__path}?perPage=${perPage}&page=${1}${
                                      queryString ? "&queryString" : ""
                                  }`
                                : undefined,
                        lastPage:
                            totalPage > 1
                                ? `${__path}?perPage=${perPage}&page=${totalPage}${
                                      queryString ? "&queryString" : ""
                                  }`
                                : undefined,
                    };

                    console.log(cursorPaginationMetadata);

                    metadata = {
                        ...metadata,
                        ..._metadata,
                        pagination: {
                            ...__pagination,
                            ...metadata["_pagination"],
                            total,
                            totalPage,
                        },
                    };

                    if (!Object.values(cursorPaginationMetadata).includes(undefined)) {
                        metadata.cursor = cursorPaginationMetadata;
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
