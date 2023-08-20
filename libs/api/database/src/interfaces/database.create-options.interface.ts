import { IDatabaseFindOneOptions } from "./database.find-options.interface";

export interface IDatabaseCreateOptions extends IDatabaseFindOneOptions {
    _id?: string;
}
