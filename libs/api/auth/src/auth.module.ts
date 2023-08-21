import { DynamicModule, Module, Provider } from "@nestjs/common";
import { AuthJwtAccessStrategy, AuthJwtRefreshStrategy } from "./guards";
import { AuthService } from "./services";

@Module({
    providers: [AuthService],
})
export class AuthModule {
    static forRoot(): DynamicModule {
        const providers: Provider[] = [AuthJwtAccessStrategy, AuthJwtRefreshStrategy];

        return {
            module: AuthModule,
            providers,
            exports: [],
            imports: [],
        };
    }
}
