import { registerAs } from "@nestjs/config";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { seconds } from "@splitz/api/helper";

export interface IHelperConfig {
    salt: {
        length: number;
    };
    jwt: {
        defaultSecretKey: string;
        defaultExpirationTime: number;
        defaultNotBeforeExpirationTime: number;
    };
}

export default registerAs(
    "helper",
    (): Record<string, any> => ({
        salt: {
            length: 8,
        },
        jwt: {
            secretKey: "123456",
            expirationTime: seconds("1h"),
            notBeforeExpirationTime: seconds("0"),
        },
    })
);
