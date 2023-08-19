import { Injectable } from "@nestjs/common";
import {
    PAGINATION_AVAILABLE_ORDER_BY,
    PAGINATION_MAX_PAGE,
    PAGINATION_MAX_PER_PAGE,
    PAGINATION_ORDER_BY,
    PAGINATION_ORDER_DIRECTION,
    PAGINATION_PAGE,
    PAGINATION_PER_PAGE,
} from "../constants/pagination.constants";
import { IPaginationOrder } from "../interfaces/pagination.interface";

@Injectable()
export class PaginationService {
    offset(page: number, perPage: number): number {
        const pageNumber = page > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : page;
        const perPageSize = perPage > PAGINATION_MAX_PER_PAGE ? PAGINATION_MAX_PER_PAGE : perPage;

        const offset: number = (pageNumber - 1) * perPageSize;

        return offset;
    }

    totalPage(totalData: number, perPage: number): number {
        let totalPage = Math.ceil(totalData / perPage);
        totalPage = totalPage === 0 ? 1 : totalPage;

        return totalPage > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : totalPage;
    }

    offsetWithoutMax(page: number, perPage: number): number {
        const offset: number = (page - 1) * perPage;

        return offset;
    }

    totalPageWithoutMax(totalData: number, perPage: number): number {
        let totalPage = Math.ceil(totalData / perPage);
        totalPage = totalPage === 0 ? 1 : totalPage;

        return totalPage;
    }

    page(page?: number): number {
        return page ? (page > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : page) : PAGINATION_PAGE;
    }

    perPage(perPage?: number): number {
        return perPage
            ? perPage > PAGINATION_MAX_PER_PAGE
                ? PAGINATION_MAX_PER_PAGE
                : perPage
            : PAGINATION_PER_PAGE;
    }

    order(
        orderByValue = PAGINATION_ORDER_BY,
        orderDirectionValue = PAGINATION_ORDER_DIRECTION,
        availableOrderBy = PAGINATION_AVAILABLE_ORDER_BY
    ): IPaginationOrder {
        const orderBy: string = availableOrderBy.includes(orderByValue)
            ? orderByValue
            : PAGINATION_ORDER_BY;

        return { [orderBy]: orderDirectionValue };
    }

    search(searchValue = "", availableSearch: string[]): Record<string, unknown> | undefined {
        if (!searchValue) {
            return undefined;
        }

        return {
            $or: availableSearch.map((val) => ({
                [val]: {
                    $regex: new RegExp(searchValue),
                    $options: "i",
                },
            })),
        };
    }

    filterEqual<T = string>(field: string, filterValue: T): Record<string, T> {
        return { [field]: filterValue };
    }

    filterContain(
        field: string,
        filterValue: string
    ): Record<string, { $regex: RegExp; $options: string }> {
        return {
            [field]: {
                $regex: new RegExp(filterValue),
                $options: "i",
            },
        };
    }

    filterContainFullMatch(
        field: string,
        filterValue: string
    ): Record<string, { $regex: RegExp; $options: string }> {
        return {
            [field]: {
                $regex: new RegExp(`\\b${filterValue}\\b`),
                $options: "i",
            },
        };
    }

    filterIn<T = string>(field: string, filterValue: T[]): Record<string, { $in: T[] }> {
        return {
            [field]: {
                $in: filterValue,
            },
        };
    }

    filterDate(field: string, filterValue: Date): Record<string, Date> {
        return {
            [field]: filterValue,
        };
    }
}
