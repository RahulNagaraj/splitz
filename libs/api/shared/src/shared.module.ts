import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./config";
import { MongooseModule } from "@nestjs/mongoose";
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
    DATABASE_CONNECTION_NAME,
    DatabaseModule,
    DatabaseOptionsService,
} from "@splitz/api/database";
import { PaginationModule } from "@splitz/api/pagination";
import { ErrorModule } from "@splitz/api/error";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { HelperModule } from "@splitz/api/helper";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthModule } from "@splitz/api/auth";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env"],
            load: configuration,
        }),
        MongooseModule.forRootAsync({
            connectionName: DATABASE_CONNECTION_NAME,
            imports: [DatabaseModule],
            inject: [DatabaseOptionsService],
            useFactory: (databaseOptionsService: DatabaseOptionsService) =>
                databaseOptionsService.createOptions(),
        }),
        PaginationModule,
        ErrorModule,
        HelperModule,
        AuthModule.forRoot(),
    ],
})
export class SharedModule {}
