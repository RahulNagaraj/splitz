import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { SharedModule } from "@splitz/api/shared";

//@TODO: Import Pagination into SharedModule and make it global;

@Module({
    imports: [SharedModule, UserModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
