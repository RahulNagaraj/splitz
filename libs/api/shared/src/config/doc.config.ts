import { registerAs } from "@nestjs/config";

export interface IDocConfig {
    name: string;
    description: string;
    version: string;
    prefix: string;
}

export default registerAs(
    "doc",
    (): IDocConfig => ({
        name: `${process.env["APP_NAME"]} APIs Specification`,
        description: "Splitz API Description",
        version: "1.0",
        prefix: "/docs",
    })
);
