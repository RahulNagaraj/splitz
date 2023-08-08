import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    username?: string;

    @IsString()
    @MaxLength(50)
    firstName: string;

    @IsString()
    @MaxLength(50)
    lastName: string;

    @IsString()
    @MaxLength(50)
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
