import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
    HelperDateTimeService,
    HelperEncryptionService,
    HelperHashService,
    HelperStringService,
} from "@splitz/api/helper";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IAuthConfig } from "@splitz/api/shared";
import { IAuthPassword, IAuthPayloadOptions, IAuthRefreshTokenOptions } from "../interfaces";

@Injectable()
export class AuthService {
    private readonly accessTokenSecretKey: string;
    private readonly accessTokenExpirationTime: number;
    private readonly accessTokenNotBeforeExpirationTime: number;
    private readonly accessTokenEncryptKey: string;
    private readonly accessTokenEncryptIv: string;

    private readonly refreshTokenSecretKey: string;
    private readonly refreshTokenExpirationTime: number;
    private readonly refreshTokenNotBeforeExpirationTime: number;
    private readonly refreshTokenEncryptKey: string;
    private readonly refreshTokenEncryptIv: string;

    private readonly payloadEncryption: boolean;
    private readonly prefixAuthorization: string;
    private readonly audience?: string;
    private readonly issuer?: string;
    private readonly subject?: string;

    private readonly passwordExpiredIn: number;
    private readonly passwordSaltLength: number;

    constructor(
        private readonly configService: ConfigService,
        private readonly helperEncryptionService: HelperEncryptionService,
        private readonly helperHashService: HelperHashService,
        private readonly helperDateTimeService: HelperDateTimeService,
        private readonly helperStringService: HelperStringService
    ) {
        const authConfig = configService.getOrThrow<IAuthConfig>("auth");
        this.accessTokenSecretKey = authConfig.accessToken.secretKey;
        this.accessTokenExpirationTime = authConfig.accessToken.expirationTime;
        this.accessTokenNotBeforeExpirationTime = authConfig.accessToken.notBeforeExpirationTime;
        this.accessTokenEncryptKey = authConfig.accessToken.encryptKey;
        this.accessTokenEncryptIv = authConfig.accessToken.encryptIv;

        this.refreshTokenSecretKey = authConfig.refreshToken.secretKey;
        this.refreshTokenExpirationTime = authConfig.refreshToken.expirationTime;
        this.refreshTokenNotBeforeExpirationTime = authConfig.refreshToken.notBeforeExpirationTime;
        this.refreshTokenEncryptKey = authConfig.refreshToken.encryptKey;
        this.refreshTokenEncryptIv = authConfig.refreshToken.encryptIv;

        this.payloadEncryption = authConfig.payloadEncryption;
        this.prefixAuthorization = authConfig.prefixAuthorization;
        this.subject = authConfig.subject;
        this.audience = authConfig.audience;
        this.issuer = authConfig.issuer;

        this.passwordExpiredIn = authConfig.password.expiredIn;
        this.passwordSaltLength = authConfig.password.saltLength;
    }

    async encryptAccessToken(payload: Record<string, any>): Promise<string> {
        return this.helperEncryptionService.aes256Encrypt(
            payload,
            this.accessTokenEncryptKey,
            this.accessTokenEncryptIv
        );
    }

    async decryptAccessToken({ data }: Record<string, any>): Promise<Record<string, any>> {
        return this.helperEncryptionService.aes256Decrypt(
            data,
            this.accessTokenEncryptKey,
            this.accessTokenEncryptIv
        ) as Record<string, any>;
    }

    async createAccessToken(payloadHashed: string | Record<string, any>): Promise<string> {
        return this.helperEncryptionService.jwtEncrypt(
            { data: payloadHashed },
            {
                secretKey: this.accessTokenSecretKey,
                expiredIn: this.accessTokenExpirationTime,
                notBefore: this.accessTokenNotBeforeExpirationTime,
                audience: this.audience,
                issuer: this.issuer,
                subject: this.subject,
            }
        );
    }

    async validateAccessToken(token: string): Promise<boolean> {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.accessTokenSecretKey,
            audience: this.audience,
            issuer: this.issuer,
            subject: this.subject,
        });
    }

    async payloadAccessToken(token: string): Promise<Record<string, any>> {
        return this.helperEncryptionService.jwtDecrypt(token);
    }

    async encryptRefreshToken(payload: Record<string, any>): Promise<string> {
        return this.helperEncryptionService.aes256Encrypt(
            payload,
            this.refreshTokenEncryptKey,
            this.refreshTokenEncryptIv
        );
    }

    async decryptRefreshToken({ data }: Record<string, any>): Promise<Record<string, any>> {
        return this.helperEncryptionService.aes256Decrypt(
            data,
            this.refreshTokenEncryptKey,
            this.refreshTokenEncryptIv
        ) as Record<string, any>;
    }

    async createRefreshToken(
        payloadHashed: string | Record<string, any>,
        options?: IAuthRefreshTokenOptions
    ): Promise<string> {
        return this.helperEncryptionService.jwtEncrypt(
            { data: payloadHashed },
            {
                secretKey: this.refreshTokenSecretKey,
                expiredIn: this.refreshTokenExpirationTime,
                notBefore:
                    options?.notBeforeExpirationTime ?? this.refreshTokenNotBeforeExpirationTime,
                audience: this.audience,
                issuer: this.issuer,
                subject: this.subject,
            }
        );
    }

    async validateRefreshToken(token: string): Promise<boolean> {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.refreshTokenSecretKey,
            audience: this.audience,
            issuer: this.issuer,
            subject: this.subject,
        });
    }

    async validateUser(passwordString: string, passwordHash: string): Promise<boolean> {
        return this.helperHashService.bcryptCompare(passwordString, passwordHash);
    }

    async createPayloadAccessToken(data: Record<string, any>): Promise<Record<string, any>> {
        return data;
    }

    async createPayloadRefreshToken(
        _id: string,
        options: IAuthPayloadOptions
    ): Promise<Record<string, any>> {
        return {
            _id,
            loginDate: this.helperDateTimeService.create(),
            loginWith: options.loginWith,
        };
    }

    async createSalt(length: number): Promise<string> {
        return this.helperHashService.randomSalt(length);
    }

    async createPassword(password: string): Promise<IAuthPassword> {
        const salt: string = await this.createSalt(this.passwordSaltLength);

        const passwordExpired: Date = this.helperDateTimeService.forwardInSeconds(
            this.passwordExpiredIn
        );
        const passwordCreated: Date = this.helperDateTimeService.create();
        const passwordHash = this.helperHashService.bcrypt(password, salt);
        return {
            passwordHash,
            passwordExpired,
            passwordCreated,
            salt,
        };
    }

    async createPasswordRandom(): Promise<string> {
        return this.helperStringService.random(15);
    }

    async checkPasswordExpired(passwordExpired: Date): Promise<boolean> {
        const today: Date = this.helperDateTimeService.create();
        const passwordExpiredConvert: Date = this.helperDateTimeService.create(passwordExpired);

        return today > passwordExpiredConvert;
    }

    async payloadRefreshToken(token: string): Promise<Record<string, any>> {
        return this.helperEncryptionService.jwtDecrypt(token);
    }

    async getTokenType(): Promise<string> {
        return this.prefixAuthorization;
    }

    async getAccessTokenExpirationTime(): Promise<number> {
        return this.accessTokenExpirationTime;
    }

    async getRefreshTokenExpirationTime(): Promise<number> {
        return this.refreshTokenExpirationTime;
    }

    async getIssuer(): Promise<string | undefined> {
        return this.issuer;
    }

    async getAudience(): Promise<string | undefined> {
        return this.audience;
    }

    async getSubject(): Promise<string | undefined> {
        return this.subject;
    }

    async getPayloadEncryption(): Promise<boolean> {
        return this.payloadEncryption;
    }
}
