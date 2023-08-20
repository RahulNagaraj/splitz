import { IDatabaseFindOneOptions } from "./database.find-options.interface";

export interface IDatabaseExistOptions
    extends Pick<IDatabaseFindOneOptions, "withDeleted" | "join"> {
    excludeId?: string[];
}
