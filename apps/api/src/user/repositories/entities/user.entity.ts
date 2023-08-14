import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { DatabaseEntity, DatabaseMongoEntityAbstract } from "@splitz/api/shared";
import { CallbackWithoutResultAndOptionalError, Types, Document } from "mongoose";

@DatabaseEntity({ collection: "users" })
export class UserEntity extends DatabaseMongoEntityAbstract {
    @Prop({
        required: false,
        sparse: true,
        index: true,
        trim: true,
        type: String,
        unique: true,
        maxlength: 50,
    })
    username?: string;

    @Prop({
        required: true,
        index: true,
        trim: true,
        type: String,
        maxlength: 50,
    })
    firstName: string;

    @Prop({
        required: true,
        index: true,
        trim: true,
        type: String,
        maxlength: 50,
    })
    lastName: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        trim: true,
        type: String,
        maxlength: 100,
    })
    email: string;

    @Prop({
        required: true,
        type: String,
    })
    password: string;

    constructor(data: Partial<UserEntity>) {
        super();
        Object.assign(
            this,
            {
                _id: new Types.ObjectId(),
            },
            data
        );
    }
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

UserSchema.pre("save", function (next: CallbackWithoutResultAndOptionalError) {
    this.email = this.email.toLowerCase();
    next();
});
