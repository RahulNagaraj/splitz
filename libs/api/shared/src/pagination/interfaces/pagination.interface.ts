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
