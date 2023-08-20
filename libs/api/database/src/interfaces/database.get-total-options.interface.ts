import { IDatabaseFindOneOptions } from "./database.find-options.interface";

export type IDatabaseGetTotalOptions = Pick<IDatabaseFindOneOptions, "withDeleted" | "join">;
