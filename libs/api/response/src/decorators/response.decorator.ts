import { SetMetadata, UseInterceptors, applyDecorators } from "@nestjs/common";
import { ResponseDefaultInterceptor, ResponsePagingInterceptor } from "../interceptors";
import { ResponseDefaultSerialization } from "../serializations";
import {
    RESPONSE_SERIALIZATION_META_KEY,
    RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from "../constants";
import { IResponseOptions, IResponsePagingOptions } from "../interfaces";

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
