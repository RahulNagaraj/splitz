import { IDatabaseFindOneOptions } from "./database.find-options.interface";

export type IDatabaseRawOptions = Pick<IDatabaseFindOneOptions, "withDeleted">;
