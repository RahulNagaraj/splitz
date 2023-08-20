import { IPaginationOptions } from "@splitz/api/pagination";
import { PopulateOptions } from "mongoose";

export interface IDatabaseFindOneOptions extends Pick<IPaginationOptions, "order"> {
    select?: Record<string, boolean | number>;
    join?: boolean | PopulateOptions | PopulateOptions[];
    withDeleted?: boolean;
}

export interface IDatabaseFindAllOptions
    extends IPaginationOptions,
        Omit<IDatabaseFindOneOptions, "order"> {}
