import { ApiHideProperty } from "@nestjs/swagger";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants/pagination.constants";
import { IPaginationOrder } from "../interfaces/pagination.interface";

export class PaginationListDto {
    @ApiHideProperty()
    _search?: Record<string, unknown>;

    @ApiHideProperty()
    _limit?: number;

    @ApiHideProperty()
    _offset?: number;

    @ApiHideProperty()
    _order?: IPaginationOrder;

    @ApiHideProperty()
    _availableOrderBy?: string[];

    @ApiHideProperty()
    _availableOrderDirection?: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;
}
