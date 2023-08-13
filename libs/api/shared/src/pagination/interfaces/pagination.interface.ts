import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants/pagination.constants";

export interface IPaginationPaging {
    limit?: number;
    offset?: number;
}

export type IPaginationOrder = Record<string, ENUM_PAGINATION_ORDER_DIRECTION_TYPE>;

export interface IPaginationOptions {
    paging?: IPaginationPaging;
    order?: IPaginationOrder;
}

export interface IPagingationSearchPipe {
    search?: string;
}

export interface IPagingationOrderPipe {
    orderBy?: string;
    orderDirection?: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;
}

export interface IPaginationPagingPipe {
    perPage?: string;
    page?: string;
}
