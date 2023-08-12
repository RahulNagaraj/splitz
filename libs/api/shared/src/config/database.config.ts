import { registerAs } from "@nestjs/config";

export interface IDatabaseConfig {
    host: string;
    name: string;
    user?: string;
    password?: string;
    options?: string;
}

export default registerAs(
    "database",
    (): IDatabaseConfig => ({
        host: process.env?.["DATABASE_HOST"] ?? "mongodb://localhost:27018",
        name: process.env?.["DATABASE_NAME"] ?? "splitz",
        user: process.env?.["DATABASE_USER"],
        password: process?.env["DATABASE_PASSWORD"],
        options: process.env?.["DATABASE_OPTIONS"],
    })
);
