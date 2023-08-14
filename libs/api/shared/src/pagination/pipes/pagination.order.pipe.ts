import { Inject, Injectable, PipeTransform, Type, mixin } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { PaginationService } from "../services/pagination.service";
import {
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
    PAGINATION_AVAILABLE_ORDER_DIRECTION,
} from "../constants/pagination.constants";
import { IRequestApp } from "../../request/interfaces/request.interface";
import { IPagingationOrderPipe } from "../interfaces/pagination.interface";

export function PaginationOrderPipe(
    defaultOrderBy: string,
    defaultOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
    availableOrderBy: string[]
): Type<PipeTransform> {
    @Injectable()
    class MixinPaginationOrderPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: IPagingationOrderPipe): Promise<Record<string, unknown>> {
            const orderBy = value?.orderBy ?? defaultOrderBy;
            const orderDirection = value?.orderDirection ?? defaultOrderDirection;
            const availableOrderDirection = PAGINATION_AVAILABLE_ORDER_DIRECTION;

            const order = this.paginationService.order(
                orderBy,
                orderDirection,
                availableOrderDirection
            );

            this.request.__pagination = {
                ...this.request.__pagination,
                orderBy,
                orderDirection,
                availableOrderDirection,
                availableOrderBy,
            };

            return {
                ...value,
                _order: order,
                _availableOrderBy: availableOrderBy,
                _availableOrderDirection: availableOrderDirection,
            };
        }
    }

    return mixin(MixinPaginationOrderPipe);
}
