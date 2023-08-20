import { HttpStatus, applyDecorators } from "@nestjs/common";
import {
    IDocDefaultOptions,
    IDocOfOptions,
    IDocOptions,
    IDocRequestOptions,
    IDocResponseOptions,
    IDocResponsePagingOptions,
} from "../interfaces";
import {
    ApiConsumes,
    ApiExtraModels,
    ApiHeaders,
    ApiOperation,
    ApiParam,
    ApiProduces,
    ApiQuery,
    ApiResponse,
    getSchemaPath,
} from "@nestjs/swagger";
import { ENUM_DOC_REQUEST_BODY_TYPE } from "../constants";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "@splitz/api/pagination";
import { ResponseDefaultSerialization, ResponsePagingSerialization } from "@splitz/api/response";

export function SwaggerDocDefault<T>(options: IDocDefaultOptions): MethodDecorator {
    const docs = [];
    const schema: Record<string, any> = {
        allOf: [],
        properties: {
            statusCode: {
                type: "number",
                example: options.statusCode,
            },
        },
    };

    if (options.serialization) {
        docs.push(ApiExtraModels(options.serialization));
        schema["properties"] = {
            ...schema["properties"],
            data: {
                $ref: getSchemaPath(options.serialization),
            },
        };
    }

    return applyDecorators(
        ApiExtraModels(ResponseDefaultSerialization<T>),
        ApiResponse({ status: options.httpStatus, schema }),
        ...docs
    );
}

export function SwaggerDoc(options?: IDocOptions): MethodDecorator {
    const currentTimestamp = new Date().valueOf();

    return applyDecorators(
        ApiOperation({
            summary: options?.operation,
            deprecated: options?.deprecated,
            description: options?.description,
        }),
        ApiHeaders([
            {
                name: "x-timestamp",
                description: "Timestamp header, in microseconds",
                required: false,
                schema: {
                    default: currentTimestamp,
                    example: currentTimestamp,
                    type: "number",
                },
            },
        ]),
        SwaggerDocDefault({
            httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
            statusCode: 503,
        }),
        SwaggerDocDefault({
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
            statusCode: 500,
        })
    );
}

export function SwaggerDocRequest(options?: IDocRequestOptions): MethodDecorator {
    const docs: Array<ClassDecorator | MethodDecorator> = [];

    if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.JSON) {
        docs.push(ApiConsumes("application/json"));
    } else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.TEXT) {
        docs.push(ApiConsumes("text/plain"));
    }

    if (options?.bodyType) {
        docs.push(
            SwaggerDocDefault({
                httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
                statusCode: 5070,
            })
        );
    }

    if (options?.params) {
        const params = options.params.map((param) => ApiParam(param));
        docs.push(...params);
    }

    if (options?.queries) {
        const queries = options.queries.map((query) => ApiQuery(query));
        docs.push(...queries);
    }

    return applyDecorators(...docs);
}

export function SwaggerDocResponse<T = void>(options?: IDocResponseOptions<T>): MethodDecorator {
    const docResponseOptions: IDocDefaultOptions = {
        httpStatus: options?.httpStatus ?? HttpStatus.OK,
        statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK,
    };

    if (options?.serialization) {
        docResponseOptions.serialization = options.serialization;
    }
    return applyDecorators(ApiProduces("application/json"), SwaggerDocDefault(docResponseOptions));
}

export function SwaggerDocResponsePaging<T = void>(
    options: IDocResponsePagingOptions<T>
): MethodDecorator {
    const docResponseOptions: IDocResponsePagingOptions<T> = {
        httpStatus: options?.httpStatus ?? HttpStatus.OK,
        statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK,
        serialization: options.serialization,
    };

    return applyDecorators(
        ApiProduces("application/json"),
        ApiQuery({
            name: "search",
            required: false,
            allowEmptyValue: true,
            type: "string",
            description:
                "Search will base on _metadata.pagination._availableSearch with rule contains, and case insensitive",
        }),
        ApiQuery({
            name: "perPage",
            required: false,
            allowEmptyValue: true,
            example: 20,
            type: "number",
            description: "Data per page, max 100",
        }),
        ApiQuery({
            name: "page",
            required: false,
            allowEmptyValue: true,
            example: 1,
            type: "number",
            description: "page number, max 20",
        }),
        ApiQuery({
            name: "orderBy",
            required: false,
            allowEmptyValue: true,
            example: "createdAt",
            type: "string",
            description: "Order by base on _metadata.pagination.availableOrderBy",
        }),
        ApiQuery({
            name: "orderDirection",
            required: false,
            allowEmptyValue: true,
            example: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
            enum: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
            type: "string",
            description: "Order direction base on _metadata.pagination.availableOrderDirection",
        }),
        ApiExtraModels(ResponsePagingSerialization<T>),
        ApiExtraModels(docResponseOptions.serialization),
        ApiResponse({
            status: docResponseOptions.httpStatus,
            schema: {
                allOf: [{ $ref: getSchemaPath(ResponsePagingSerialization<T>) }],
                properties: {
                    statusCode: {
                        type: "number",
                        example: docResponseOptions.statusCode,
                    },
                    data: {
                        type: "array",
                        items: {
                            $ref: getSchemaPath(docResponseOptions.serialization),
                        },
                    },
                },
            },
        })
    );
}

export function SwaggerDocOneOf<T>(
    httpStatus: HttpStatus,
    ...documents: IDocOfOptions[]
): MethodDecorator {
    const docs = [];
    const oneOf = [];

    for (const doc of documents) {
        const oneOfSchema: Record<string, any> = {
            allOf: [{ $ref: getSchemaPath(ResponseDefaultSerialization<T>) }],
            properties: {
                statusCode: {
                    type: "number",
                    example: doc.statusCode ?? HttpStatus.OK,
                },
            },
        };

        if (doc.serialization) {
            docs.push(ApiExtraModels(doc.serialization));
            oneOfSchema["properties"] = {
                ...oneOfSchema["properties"],
                data: {
                    $ref: getSchemaPath(doc.serialization),
                },
            };
        }

        oneOf.push(oneOfSchema);
    }

    return applyDecorators(
        ApiExtraModels(ResponseDefaultSerialization<T>),
        ApiResponse({ status: httpStatus, schema: { oneOf } }),
        ...docs
    );
}

export function SwaggerDocAnyOf<T>(
    httpStatus: HttpStatus,
    ...documents: IDocOfOptions[]
): MethodDecorator {
    const docs = [];
    const anyOf = [];

    for (const doc of documents) {
        const anyOfSchema: Record<string, any> = {
            allOf: [{ $ref: getSchemaPath(ResponseDefaultSerialization<T>) }],
            properties: {
                statusCode: {
                    type: "number",
                    example: doc.statusCode ?? HttpStatus.OK,
                },
            },
        };

        if (doc.serialization) {
            docs.push(ApiExtraModels(doc.serialization));
            anyOfSchema["properties"] = {
                ...anyOfSchema["properties"],
                data: {
                    $ref: getSchemaPath(doc.serialization),
                },
            };
        }

        anyOf.push(anyOfSchema);
    }

    return applyDecorators(
        ApiExtraModels(ResponseDefaultSerialization<T>),
        ApiResponse({
            status: httpStatus,
            schema: {
                anyOf,
            },
        }),
        ...docs
    );
}
