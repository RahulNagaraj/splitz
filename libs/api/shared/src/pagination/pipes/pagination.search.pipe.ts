import { Inject, Injectable, PipeTransform, Scope, Type, mixin } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { PaginationService } from "../services/pagination.service";

export function PaginationSearchPipe(availableSearch: string[]): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationSearchPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: any,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: Record<string, any>): Promise<Record<string, unknown>> {
            const searchText = value?.["search"] ?? "";
            const search = this.paginationService.search(searchText, availableSearch);

            if (!searchText) throw new Error("");

            this.request.__pagination = {
                ...this.request.__pagination,
                search: searchText,
                availableSearch,
            };

            return {
                ...value,
                _search: search,
                _availableSearch: availableSearch,
            };
        }
    }
    return mixin(MixinPaginationSearchPipe);
}
