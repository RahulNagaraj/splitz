import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/user.create-user.dto";
import { IResponsePaging, Response, ResponsePaging, IResponse } from "@splitz/api/shared";
import { UserListSerialization } from "../serializations/user.list.serialization";
import {
    USER_DEFAULT_AVAILABLE_ORDER_BY,
    USER_DEFAULT_AVAILABLE_SEARCH,
    USER_DEFAULT_ORDER_BY,
    USER_DEFAULT_ORDER_DIRECTION,
    USER_DEFAULT_PAGE,
    USER_DEFAULT_PER_PAGE,
} from "../constants/user.constants";
import { UserListDoc } from "../docs/user.list.doc";
import { FindOneUserDoc } from "../docs/user.find-one.doc";
import { UserSerialization } from "../serializations/user.serialization";
import { PaginationListDto, PaginationQuery, PaginationService } from "@splitz/api/pagination";

@Controller({ version: "1", path: "/users" })
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly paginationService: PaginationService
    ) {}

    @Get("/")
    @UserListDoc()
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

    @Post("/create")
    public async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get("/:userId")
    @FindOneUserDoc()
    @Response({
        serialization: UserSerialization,
    })
    public async getUser(@Param("userId") userId: string): Promise<IResponse> {
        const user = await this.userService.findOne(userId);

        return {
            data: user,
        };
    }
}
