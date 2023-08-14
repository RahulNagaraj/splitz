import { HttpStatus } from "@nestjs/common";
import { ClassConstructor, ClassTransformOptions } from "class-transformer";

// Decorator options
export interface IResponseOptions<T> {
    serialization?: ClassConstructor<T>;
    serializationOptions?: ClassTransformOptions;
}

export interface IResponsePagingOptions<T> extends Omit<IResponseOptions<T>, "serialization"> {
    serialization: ClassConstructor<T>;
}

// Metadata
export interface IResponseCustomPropertyMetadata {
    statusCode?: number;
    message?: string;
    httpStatus?: HttpStatus;
    messageProperties?: Record<string, string | number>;
}

export interface IResponseMetadata {
    customProperty?: IResponseCustomPropertyMetadata;
    [key: string]: any;
}

// Response type
export interface IResponse {
    _metadata?: IResponseMetadata;
    data?: Record<string, any> | undefined;
}

export interface IResponsePagingPagination {
    totalPage: number;
    total: number;
}

export interface IResponsePaging {
    _metadata?: IResponseMetadata;
    _pagination: IResponsePagingPagination;
    data: Record<string, any>[];
}
