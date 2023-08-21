import ms = require("ms");

export function seconds(msValue: string): number {
    return ms(msValue) / 1000;
}
