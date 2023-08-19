import { IPaginationOptions } from "@splitz/api/pagination";
import { PopulateOptions } from "mongoose";

// Find
export interface IDatabaseFindOneOptions extends Pick<IPaginationOptions, "order"> {
    select?: Record<string, boolean | number>;
    join?: boolean | PopulateOptions | PopulateOptions[];
    withDeleted?: boolean;
}

export interface IDatabaseFindAllOptions
    extends IPaginationOptions,
        Omit<IDatabaseFindOneOptions, "order"> {}

export type IDatabaseGetTotalOptions = Pick<IDatabaseFindOneOptions, "withDeleted" | "join">;

export interface IDatabaseExistOptions
    extends Pick<IDatabaseFindOneOptions, "withDeleted" | "join"> {
    excludeId?: string[];
}

// Create
export interface IDatabaseCreateOptions extends IDatabaseFindOneOptions {
    _id?: string;
}

export type IDatabaseSaveOptions = IDatabaseFindOneOptions;

// Bulk
export interface IDatabaseCreateOptions extends IDatabaseFindOneOptions {
    _id?: string;
}
export type IDatabaseManyOptions = Pick<IDatabaseFindOneOptions, "join">;

export type IDatabaseCreateManyOptions = IDatabaseFindOneOptions;

export type IDatabaseSoftDeleteManyOptions = IDatabaseManyOptions;

// Raw
export type IDatabaseRawOptions = Pick<IDatabaseFindOneOptions, "withDeleted">;
