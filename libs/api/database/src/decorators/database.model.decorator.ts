import { InjectModel } from "@nestjs/mongoose";
import { DATABASE_CONNECTION_NAME } from "../constants";

export function DatabaseModel(modelName: string, connectionName?: string): ParameterDecorator {
    return InjectModel(modelName, connectionName ?? DATABASE_CONNECTION_NAME);
}
