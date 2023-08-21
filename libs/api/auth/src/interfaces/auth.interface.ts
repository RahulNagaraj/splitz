import { ENUM_AUTH_LOGIN_WITH } from "../constants";

export interface IAuthRefreshTokenOptions {
    // in milis
    notBeforeExpirationTime?: number | string;
}

export interface IAuthPayloadOptions {
    loginWith: ENUM_AUTH_LOGIN_WITH;
}

export interface IAuthPassword {
    salt: string;
    passwordHash: string;
    passwordExpired: Date;
    passwordCreated: Date;
}
