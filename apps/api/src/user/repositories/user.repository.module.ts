import { Module } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserEntity, UserSchema } from "./entities/user.entity";
import { DATABASE_CONNECTION_NAME } from "@splitz/api/database";

@Module({
    providers: [UserRepository],
    exports: [UserRepository],
    imports: [
        MongooseModule.forFeature(
            [{ name: UserEntity.name, schema: UserSchema }],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class UserRepositoryModule {}
