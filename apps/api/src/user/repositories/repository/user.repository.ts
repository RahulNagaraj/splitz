import { Injectable } from "@nestjs/common";
import { DatabaseMongoRepositoryAbstract } from "@splitz/api/shared";
import { UserDocument, UserEntity } from "../entities/user.entity";
import { DatabaseModel } from "@splitz/api/shared";
import { Model } from "mongoose";

@Injectable()
export class UserRepository extends DatabaseMongoRepositoryAbstract<UserEntity, UserDocument> {
    constructor(@DatabaseModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {
        super(userModel);
    }
}
