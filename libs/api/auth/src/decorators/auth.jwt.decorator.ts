import { ExecutionContext, UseGuards, applyDecorators, createParamDecorator } from "@nestjs/common";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IRequestApp } from "@splitz/api/request";
import { AuthJwtAccessGuard, AuthJwtRefreshGuard } from "../guards";

export const AuthJwtPayload = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { user: Record<string, any> }>();

        return data ? user[data] : user;
    }
);

export const AuthJwtToken = createParamDecorator(
    (_: string, ctx: ExecutionContext): string | undefined => {
        const { headers } = ctx.switchToHttp().getRequest<IRequestApp>();
        const { authorization } = headers;

        if (!authorization) return undefined;

        const authorizations = authorization.split(" ");

        return authorizations.length >= 2 ? authorizations[1] : undefined;
    }
);

export function AuthJwtAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtRefreshProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}
