import { Injectable } from "@nestjs/common";
import { UserDocument, UserEntity } from "../entities/user.entity";
import { Model } from "mongoose";
import { DatabaseModel, DatabaseMongoRepositoryAbstract } from "@splitz/api/database";

@Injectable()
export class UserRepository extends DatabaseMongoRepositoryAbstract<UserEntity, UserDocument> {
    constructor(@DatabaseModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {
        super(userModel);
    }
}
