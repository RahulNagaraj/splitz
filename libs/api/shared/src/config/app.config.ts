import { registerAs } from "@nestjs/config";

export interface IAppConfig {
    name: string;
    env: string;
    globalPrefix: string;
    http: {
        host: string;
        port: number;
    };
    versioning: {
        enable: boolean;
        prefix: string;
        version: string;
    };
}

export default registerAs(
    "app",
    (): IAppConfig => ({
        name: process.env["APP_NAME"] ?? "splitz",
        env: "dev",
        globalPrefix: "api",
        http: {
            host: process.env["HTTP_HOST"] ?? "localhost",
            port: Number.parseInt(process.env["HTTP_PORT"] ?? "4001", 10),
        },
        versioning: {
            enable: process.env["HTTP_VERSIONING_ENABLE"] === "true" ?? false,
            prefix: "v",
            version: process.env["HTTP_VERSION"] ?? "1",
        },
    })
);
