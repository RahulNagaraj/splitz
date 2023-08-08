import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/user.create-user.dto";

@Controller({ version: "1", path: "/user" })
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get("/")
    public async getAllUsers() {
        return this.userService.findAll();
    }

    @Post("/create")
    public async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get("/:id")
    public async getUser(@Param("id") id: string) {
        return this.userService.findOne(id);
    }
}
