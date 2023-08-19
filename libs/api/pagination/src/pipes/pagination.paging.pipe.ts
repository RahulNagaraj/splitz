import { Inject, Injectable, PipeTransform, Scope, Type, mixin } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { PaginationService } from "../services";
import { IRequestApp } from "../../request/interfaces/request.interface";
import { IPaginationPagingPipe } from "../interfaces";

export function PaginationPagingPipe(
    defaultPage: number,
    defaultPerPage: number
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationPagingPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: IPaginationPagingPipe): Promise<Record<string, unknown>> {
            const pageValue = Number(value?.page ?? defaultPage);
            const perPageValue = Number(value?.perPage ?? defaultPerPage);
            const page = this.paginationService.page(pageValue ?? 1);
            const perPage = this.paginationService.perPage(perPageValue);
            const offset = this.paginationService.offset(page, perPage);

            this.request.__pagination = {
                ...this.request.__pagination,
                page,
                perPage,
            };

            return {
                ...value,
                page,
                perPage,
                _limit: perPage,
                _offset: offset,
            };
        }
    }

    return mixin(MixinPaginationPagingPipe);
}
