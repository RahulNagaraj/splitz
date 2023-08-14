import { ResponseIdSerialization } from "@splitz/api/shared";
import { Exclude } from "class-transformer";

export class UserListSerialization extends ResponseIdSerialization {
    readonly username: string;

    readonly firstName: string;

    readonly lastName: string;

    readonly email: string;

    @Exclude()
    readonly password: string;

    @Exclude()
    readonly createdAt: string;

    @Exclude()
    readonly updatedAt: string;
}
