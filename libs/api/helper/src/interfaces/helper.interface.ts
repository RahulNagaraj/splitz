import { ENUM_HELPER_DATE_DIFF } from "../constants";

export interface IHelperJwtVerifyOptions {
    audience?: string;
    issuer?: string;
    subject?: string;
    secretKey: string;
}

export interface IHelperJwtOptions extends IHelperJwtVerifyOptions {
    expiredIn: number | string;
    notBefore?: number | string;
}

export interface IHelperDateOptionsCreate {
    startOfDay?: boolean;
}

export interface IHelperDateOptionsDiff {
    format?: ENUM_HELPER_DATE_DIFF;
}

export interface IHelperDateOptionsForward {
    fromDate?: Date;
}

export interface IHelperStringRandomOptions {
    upperCase?: boolean;
    safe?: boolean;
    prefix?: string;
}
