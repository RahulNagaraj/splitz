import { IDatabaseFindOneOptions } from "./database.find-options.interface";

export type IDatabaseManyOptions = Pick<IDatabaseFindOneOptions, "join">;

export type IDatabaseCreateManyOptions = IDatabaseFindOneOptions;

export type IDatabaseSoftDeleteManyOptions = IDatabaseManyOptions;
