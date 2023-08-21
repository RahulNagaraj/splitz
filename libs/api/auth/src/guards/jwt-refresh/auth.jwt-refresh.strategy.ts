import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../../services";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IAuthConfig } from "@splitz/api/shared";

@Injectable()
export class AuthJwtRefreshStrategy extends PassportStrategy(Strategy, "jwtRefresh") {
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
            secretOrKey: authConfig.refreshToken.secretKey,
        });
    }

    async validate({ data }: Record<string, any>): Promise<Record<string, any>> {
        const payloadEncryption: boolean = await this.authService.getPayloadEncryption();

        return payloadEncryption ? this.authService.decryptRefreshToken({ data }) : data;
    }
}
