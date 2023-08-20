import { IDatabaseFindOneOptions } from "./database.find-one-options.interface";

export type IDatabaseGetTotalOptions = Pick<IDatabaseFindOneOptions, "withDeleted" | "join">;
