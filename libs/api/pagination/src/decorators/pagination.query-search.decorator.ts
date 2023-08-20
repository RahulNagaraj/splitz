import { Query } from "@nestjs/common";
import { PaginationSearchPipe } from "../pipes";

export function PaginationQuerySearch(availableSearch: string[]): ParameterDecorator {
    return Query(PaginationSearchPipe(availableSearch));
}
