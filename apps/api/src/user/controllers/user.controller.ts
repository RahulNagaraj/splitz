import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/user.create-user.dto";
import { PaginationQuery, PaginationService, PaginationConstants } from "@splitz/api/shared";

@Controller({ version: "1", path: "/user" })
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly paginationService: PaginationService
    ) {}
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

    @Get("/list")
    public async listOfUsers(
        @PaginationQuery(
            10,
            "createdAt",
            PaginationConstants.ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
            [],
            []
        )
        { _search, _limit, _offset, _order }
    ): Promise<any> {
        const find = { ..._search };

        const users = await this.userService.findAll(find, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
        });

        const total = await this.userService.getTotal(find);
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: users,
        };
    }
}
