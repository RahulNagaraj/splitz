import { Request } from "express";
import { RequestPaginationSerialization } from "../serializations";

export interface IRequestApp extends Request {
    user?: Record<string, any>;

    __id: string;
    __xTimestamp?: number;
    __timestamp: number;
    __timezone: string;

    __filters?: Record<string, string | number | boolean | Array<string | number | boolean>>;
    __pagination?: RequestPaginationSerialization;
}
