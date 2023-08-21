import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../../services";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IAuthConfig } from "@splitz/api/shared";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
        const authConfig = configService.getOrThrow<IAuthConfig>("auth");
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(authConfig.prefixAuthorization),
            ignoreExpiration: false,
            jsonWebTokenOptions: {
                ignoreNotBefore: false,
                audience: authConfig.audience,
                issuer: authConfig.issuer,
                subject: authConfig.subject,
            },
            secretOrKey: authConfig.accessToken.secretKey,
        });
    }

    async validate({ data }: Record<string, any>) {
        const payloadEncryption = await this.authService.getPayloadEncryption();

        return payloadEncryption ? this.authService.decryptAccessToken({ data }) : data;
    }
}
