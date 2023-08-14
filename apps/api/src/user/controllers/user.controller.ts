import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/user.create-user.dto";
import {
    PaginationQuery,
    PaginationService,
    IResponsePaging,
    ResponsePaging,
    PaginationListDto,
} from "@splitz/api/shared";
import { UserListSerialization } from "../serializations/user.list.serialization";
import {
    USER_DEFAULT_AVAILABLE_ORDER_BY,
    USER_DEFAULT_AVAILABLE_SEARCH,
    USER_DEFAULT_ORDER_BY,
    USER_DEFAULT_ORDER_DIRECTION,
    USER_DEFAULT_PAGE,
    USER_DEFAULT_PER_PAGE,
} from "../constants/user.constants";

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
    @ResponsePaging({
        serialization: UserListSerialization,
    })
    public async listOfUsers(
        @PaginationQuery(
            USER_DEFAULT_PAGE,
            USER_DEFAULT_PER_PAGE,
            USER_DEFAULT_ORDER_BY,
            USER_DEFAULT_ORDER_DIRECTION,
            USER_DEFAULT_AVAILABLE_ORDER_BY,
            USER_DEFAULT_AVAILABLE_SEARCH
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ): Promise<IResponsePaging> {
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
