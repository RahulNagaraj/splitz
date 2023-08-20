import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants";

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
