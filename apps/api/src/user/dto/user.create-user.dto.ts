import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MaxLength(50)
    @ApiProperty({ required: true })
    username: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @ApiProperty({ required: true })
    firstName: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @ApiProperty({ required: true })
    lastName: string;

    @IsString()
    @MaxLength(50)
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;

    @IsString()
    @ApiProperty({ required: true })
    password: string;
}
