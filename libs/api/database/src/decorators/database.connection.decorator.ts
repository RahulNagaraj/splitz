import { InjectConnection } from "@nestjs/mongoose";
import { DATABASE_CONNECTION_NAME } from "../constants";

export function DatabaseConnection(connectionName?: string) {
    return InjectConnection(connectionName ?? DATABASE_CONNECTION_NAME);
}
