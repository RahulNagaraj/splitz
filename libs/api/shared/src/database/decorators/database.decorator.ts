import { InjectConnection, InjectModel, Schema, SchemaOptions } from "@nestjs/mongoose";
import {
    DATABASE_CONNECTION_NAME,
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_UPDATED_AT_FIELD_NAME,
} from "../constants/database.constants";

export function DatabaseConnection(connectionName?: string) {
    return InjectConnection(connectionName ?? DATABASE_CONNECTION_NAME);
}

export function DatabaseModel(modelName: string, connectionName?: string): ParameterDecorator {
    return InjectModel(modelName, connectionName ?? DATABASE_CONNECTION_NAME);
}

export function DatabaseEntity(options?: SchemaOptions): ClassDecorator {
    return Schema({
        ...options,
        versionKey: false,
        timestamps: {
            createdAt: DATABASE_CREATED_AT_FIELD_NAME,
            updatedAt: DATABASE_UPDATED_AT_FIELD_NAME,
        },
    });
}
