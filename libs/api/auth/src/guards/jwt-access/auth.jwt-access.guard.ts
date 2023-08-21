import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ENUM_AUTH_STATUS_CODE_ERROR } from "../../constants";

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard("jwt") {
    override handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
        if (err || !user) {
            throw new UnauthorizedException({
                statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR,
                message: "Not authorized",
                _error: err ? err.message : info.message,
            });
        }

        return user;
    }
}
