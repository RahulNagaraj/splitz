import { IDatabaseFindOneOptions } from "./database.find-one-options.interface";

export interface IDatabaseExistOptions
    extends Pick<IDatabaseFindOneOptions, "withDeleted" | "join"> {
    excludeId?: string[];
}
