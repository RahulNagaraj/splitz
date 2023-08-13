import { Inject, Injectable, PipeTransform, Scope, Type, mixin } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { PaginationService } from "../services/pagination.service";
import { IRequestApp } from "../../request/interfaces/request.interface";
import { IPagingationSearchPipe } from "../interfaces/pagination.interface";

export function PaginationSearchPipe(availableSearch: string[]): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationSearchPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: IPagingationSearchPipe): Promise<Record<string, unknown>> {
            const searchText = value?.["search"] ?? "";
            const search = this.paginationService.search(searchText, availableSearch);

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
