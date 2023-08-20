import { Types } from "mongoose";
import {
    DATABASE_DELETED_AT_FIELD_NAME,
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_UPDATED_AT_FIELD_NAME,
} from "../constants";

export abstract class DatabaseBaseEntityAbstract {
    abstract _id: Types.ObjectId;
    abstract [DATABASE_DELETED_AT_FIELD_NAME]?: Date;
    abstract [DATABASE_CREATED_AT_FIELD_NAME]?: Date;
    abstract [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}
