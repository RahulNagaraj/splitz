import { HttpStatus } from "@nestjs/common";
import { ApiParamOptions, ApiQueryOptions } from "@nestjs/swagger";
import { ClassConstructor } from "class-transformer";
import { ENUM_DOC_REQUEST_BODY_TYPE } from "../constants";

export interface IDocOptions {
    operation?: string;
    deprecated?: boolean;
    description?: string;
}

export interface IDocOfOptions {
    statusCode: number;
    serialization?: ClassConstructor<any>;
}

export interface IDocDefaultOptions extends IDocOfOptions {
    httpStatus: HttpStatus;
}

export interface IDocRequestOptions {
    params?: ApiParamOptions[];
    queries?: ApiQueryOptions[];
    bodyType?: ENUM_DOC_REQUEST_BODY_TYPE;
}

export interface IDocResponseOptions<T> {
    statusCode?: number;
    httpStatus?: HttpStatus;
    serialization?: ClassConstructor<T>;
}

export interface IDocResponsePagingOptions<T>
    extends Omit<IDocResponseOptions<T>, "serialization"> {
    serialization: ClassConstructor<T>;
}
