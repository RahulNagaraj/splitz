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
    ],
})
export class SharedModule {}
