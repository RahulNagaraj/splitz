import { Expose, Type } from "class-transformer";

export class ResponseIdSerialization {
    @Type(() => String)
    @Expose({ name: "_id" })
    readonly id!: string;
}
