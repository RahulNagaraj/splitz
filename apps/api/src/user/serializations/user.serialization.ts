import { ApiProperty } from "@nestjs/swagger";
import { ResponseIdSerialization } from "@splitz/api/shared";
import { Exclude } from "class-transformer";

export class UserSerialization extends ResponseIdSerialization {
    @ApiProperty()
    readonly username: string;

    @ApiProperty()
    readonly firstName: string;

    @ApiProperty()
    readonly lastName: string;

    @ApiProperty()
    readonly email: string;

    @Exclude()
    readonly password: string;

    @Exclude()
    readonly createdAt: string;

    @Exclude()
    readonly updatedAt: string;
}
