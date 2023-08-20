import { Module } from "@nestjs/common";
import { UserRepositoryModule } from "./repositories/user.repository.module";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";

@Module({
    imports: [UserRepositoryModule],
    exports: [],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
