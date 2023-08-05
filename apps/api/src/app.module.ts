import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env"],
            load: [configuration],
        }),
        MongooseModule.forRootAsync({
            connectionName: "splitz",
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uri = configService.getOrThrow<string>("databaseUrl");
                return { uri };
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
