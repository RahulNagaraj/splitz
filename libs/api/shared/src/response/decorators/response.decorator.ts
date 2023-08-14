import { SetMetadata, UseInterceptors, applyDecorators } from "@nestjs/common";
import { IResponseOptions, IResponsePagingOptions } from "../interfaces/response.interface";
import { ResponseDefaultInterceptor } from "../interceptors/response.default.interceptor";
import { ResponseDefaultSerialization } from "../serializations/response.default.serializatiion";
import {
    RESPONSE_SERIALIZATION_META_KEY,
    RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from "../constants/response.constants";
import { ResponsePagingInterceptor } from "../interceptors/response.paging.interceptor";

export function Response<T = ResponseDefaultSerialization>(
    options: IResponseOptions<T>
): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponseDefaultInterceptor<T>),
        SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization)
    );
}

export function ResponsePaging<T>(options: IResponsePagingOptions<T>): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponsePagingInterceptor<T>),
        SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization),
        SetMetadata(RESPONSE_SERIALIZATION_OPTIONS_META_KEY, options?.serializationOptions)
    );
}
