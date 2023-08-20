import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { HttpErrorFilter } from "./filters";

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
    ],
})
export class ErrorModule {}
