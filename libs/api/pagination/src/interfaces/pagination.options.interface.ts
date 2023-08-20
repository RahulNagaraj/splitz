import { IPaginationOrder, IPaginationPaging } from "./pagination.interface";

export interface IPaginationOptions {
    paging?: IPaginationPaging;
    order?: IPaginationOrder;
}
