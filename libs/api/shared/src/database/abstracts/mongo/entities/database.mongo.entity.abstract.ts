import { Types } from "mongoose";
import { DatabaseBaseEntityAbstract } from "../../database.base-entity.abstract";
import { Prop } from "@nestjs/mongoose";
import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_DELETED_AT_FIELD_NAME,
    DATABASE_UPDATED_AT_FIELD_NAME,
    DatabaseDefaultObjectId,
} from "../../../constants/database.constants";

export abstract class DatabaseMongoEntityAbstract extends DatabaseBaseEntityAbstract {
    @Prop({ type: Types.ObjectId, default: DatabaseDefaultObjectId })
    _id!: Types.ObjectId;

    @Prop({ required: false, index: false, type: Date })
    [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

    @Prop({ required: false, index: "asc", type: Date })
    [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

    @Prop({ required: false, index: "desc", type: Date })
    [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}
