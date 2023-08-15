import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ResponseIdSerialization {
    @Type(() => String)
    @Expose({ name: "_id" })
    @ApiProperty()
    readonly id!: string;
}
