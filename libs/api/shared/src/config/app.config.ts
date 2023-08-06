import { registerAs } from "@nestjs/config";

export interface IAppConfig {
    name: string;
    env: string;
    globalPrefix: string;
    http: {
        host: string;
        port: number;
    };
}

export default registerAs(
    "app",
    (): IAppConfig => ({
        name: process.env["APP_NAME"] ?? "splitz",
        env: "dev",
        globalPrefix: "/api",
        http: {
            host: process.env["HTTP_HOST"] ?? "localhost",
            port: Number.parseInt(process.env["HTTP_PORT"] ?? "4001", 10),
        },
    })
);
