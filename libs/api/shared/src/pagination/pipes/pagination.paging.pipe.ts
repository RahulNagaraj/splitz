import { Inject, Injectable, PipeTransform, Scope, Type, mixin } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { PaginationService } from "../services/pagination.service";

export function PaginationPagingPipe(defaultPerPage: number): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationPagingPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: any,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: Record<string, number>): Promise<Record<string, unknown>> {
            const page = this.paginationService.page(value?.["page"] ?? 1);
            const perPage = this.paginationService.perPage(value?.["perPage"] ?? defaultPerPage);
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
