import { Global, Module } from "@nestjs/common";
import {
    HelperDateTimeService,
    HelperEncryptionService,
    HelperHashService,
    HelperStringService,
} from "./services";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IHelperConfig } from "@splitz/api/shared";

@Global()
@Module({
    providers: [
        HelperEncryptionService,
        HelperDateTimeService,
        HelperHashService,
        HelperStringService,
    ],
    exports: [
        HelperEncryptionService,
        HelperDateTimeService,
        HelperHashService,
        HelperStringService,
    ],
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const helperConfig = configService.getOrThrow<IHelperConfig>("helper");
                return {
                    secret: helperConfig.jwt.defaultSecretKey,
                    signOptions: {
                        expiresIn: helperConfig.jwt.defaultExpirationTime,
                    },
                };
            },
        }),
    ],
})
export class HelperModule {}
