import { Query } from "@nestjs/common";
import { PaginationSearchPipe } from "../pipes/pagination.search.pipe";
import { PaginationPagingPipe } from "../pipes/pagination.paging.pipe";
import { PaginationOrderPipe } from "../pipes/pagination.order.pipe";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants/pagination.constants";

export function PaginationQuery(
    defaultPerPage: number,
    paginationOrderBy: string,
    paginationOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
    availableOrderBy: string[],
    availableSearch: string[]
): ParameterDecorator {
    return Query(
        PaginationSearchPipe(availableSearch),
        PaginationPagingPipe(defaultPerPage),
        PaginationOrderPipe(paginationOrderBy, paginationOrderDirection, availableOrderBy)
    );
}

export function PaginationQuerySearch(availableSearch: string[]): ParameterDecorator {
    return Query(PaginationSearchPipe(availableSearch));
}
