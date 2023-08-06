import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { configuration, DatabaseModule, DatabaseOptionsService } from "@splitz/api/shared";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env"],
            load: configuration,
        }),
        MongooseModule.forRootAsync({
            imports: [DatabaseModule],
            inject: [DatabaseOptionsService],
            useFactory: (databaseOptionsService: DatabaseOptionsService) =>
                databaseOptionsService.createOptions(),
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
