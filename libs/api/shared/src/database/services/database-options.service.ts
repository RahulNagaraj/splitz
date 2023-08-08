import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";
import { IDatabaseConfig } from "../../config/database.config";

@Injectable()
export class DatabaseOptionsService {
    constructor(private readonly configService: ConfigService) {}

    createOptions(): MongooseModuleOptions {
        const databaseConfig = this.configService.getOrThrow<IDatabaseConfig>("database");
        const database = databaseConfig.name;
        const host = databaseConfig.host;
        const user = databaseConfig.user;
        const password = databaseConfig.password;
        const options = databaseConfig.options ? `?${databaseConfig.options}` : "";

        let uri = `${host}`;

        if (database) {
            uri += `/${database}${options}`;
        }

        const mongooseOptions: MongooseModuleOptions = {
            uri,
            serverSelectionTimeoutMS: 5000,
            autoCreate: true,
        };

        if (user && password) {
            mongooseOptions.auth = {
                username: user,
                password: password,
            };
        }

        return mongooseOptions;
    }
}
