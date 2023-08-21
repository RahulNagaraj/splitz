import { Injectable } from "@nestjs/common";
import { IHelperStringRandomOptions } from "../interfaces";
import { faker } from "@faker-js/faker";

@Injectable()
export class HelperStringService {
    random(length: number, options?: IHelperStringRandomOptions): string {
        const rString = options?.safe
            ? faker.internet.password({
                  length,
                  memorable: true,
                  pattern: /[A-Z]/,
                  prefix: options?.prefix,
              })
            : faker.internet.password({
                  length,
                  memorable: false,
                  pattern: /\w/,
                  prefix: options?.prefix,
              });

        return options?.upperCase ? rString.toUpperCase() : rString;
    }
}
