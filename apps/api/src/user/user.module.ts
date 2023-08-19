import { Module } from "@nestjs/common";
import { UserRepositoryModule } from "./repositories/user.repository.module";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { PaginationService } from "@splitz/api/pagination";

//@TODO: Import Pagination into SharedModule and make it global;

@Module({
    imports: [UserRepositoryModule],
    exports: [],
    providers: [UserService, PaginationService],
    controllers: [UserController],
})
export class UserModule {}
