import { Query } from "@nestjs/common";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants";
import { PaginationSearchPipe, PaginationPagingPipe, PaginationOrderPipe } from "../pipes";

export function PaginationQuery(
    defaultPage: number,
    defaultPerPage: number,
    paginationOrderBy: string,
    paginationOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
    availableOrderBy: string[],
    availableSearch: string[]
): ParameterDecorator {
    return Query(
        PaginationSearchPipe(availableSearch),
        PaginationPagingPipe(defaultPage, defaultPerPage),
        PaginationOrderPipe(paginationOrderBy, paginationOrderDirection, availableOrderBy)
    );
}
