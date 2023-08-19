import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { configuration } from "@splitz/api/shared";
import { UserModule } from "./user/user.module";
import {
    DATABASE_CONNECTION_NAME,
    DatabaseModule,
    DatabaseOptionsService,
} from "@splitz/api/database";

//@TODO: Import Pagination into SharedModule and make it global;

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
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
