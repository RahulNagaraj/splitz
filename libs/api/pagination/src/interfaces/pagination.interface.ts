import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants";

export interface IPaginationPaging {
    limit?: number;
    offset?: number;
}

export type IPaginationOrder = Record<string, ENUM_PAGINATION_ORDER_DIRECTION_TYPE>;
