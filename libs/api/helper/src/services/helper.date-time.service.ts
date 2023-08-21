import { Injectable } from "@nestjs/common";
import {
    IHelperDateOptionsCreate,
    IHelperDateOptionsDiff,
    IHelperDateOptionsForward,
} from "../interfaces";
import { DateTime } from "luxon";
import { ENUM_HELPER_DATE_DIFF } from "../constants";

@Injectable()
export class HelperDateTimeService {
    create(date?: Date, options?: IHelperDateOptionsCreate): Date {
        const dateTime = date ? DateTime.fromJSDate(date) : DateTime.now();

        if (options?.startOfDay) {
            dateTime.startOf("day");
        }

        return dateTime.toJSDate();
    }

    diff(dateOne: Date, dateTwo: Date, options?: IHelperDateOptionsDiff): number {
        const dateTimeOne = DateTime.fromJSDate(dateOne);
        const dateTimeTwo = DateTime.fromJSDate(dateTwo);

        const diff = dateTimeOne.diff(dateTimeTwo);

        if (options?.format === ENUM_HELPER_DATE_DIFF.MILIS) {
            return diff.milliseconds;
        } else if (options?.format === ENUM_HELPER_DATE_DIFF.SECONDS) {
            return diff.seconds;
        } else if (options?.format === ENUM_HELPER_DATE_DIFF.HOURS) {
            return diff.hours;
        } else if (options?.format === ENUM_HELPER_DATE_DIFF.MINUTES) {
            return diff.minutes;
        } else {
            return diff.days;
        }
    }

    forwardInSeconds(seconds: number, options?: IHelperDateOptionsForward): Date {
        const dateTime = options?.fromDate
            ? DateTime.fromJSDate(options?.fromDate)
            : DateTime.now();
        const add = dateTime.plus({ seconds });

        return add.toJSDate();
    }
}
