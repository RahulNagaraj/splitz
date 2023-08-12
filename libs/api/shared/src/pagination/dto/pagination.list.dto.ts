import { ApiHideProperty } from "@nestjs/swagger";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants/pagination.constants";

export class PaginationListDto {
    @ApiHideProperty()
    _search?: Record<string, unknown>;

    @ApiHideProperty()
    _limit?: number;

    @ApiHideProperty()
    _offset?: number;

    @ApiHideProperty()
    _availableOrderBy?: string[];

    @ApiHideProperty()
    _availableOrderDirection?: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;
}
