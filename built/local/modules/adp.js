import getType from "./typing/getType.js";
import { parseType, parseTypeForString } from "./typing/parseType.js";
export class ADP {
    constructor(date, pattern) { }
    //! global error handling
    e(ctx, fn, ...args) {
        let options = args.pop();
        try {
            return ctx[fn](...args);
        }
        catch (err) {
            ADP.error = {
                name: options.name,
                message: options.message,
                stack: err.stack.split("\n"),
            };
            throw ADP.error;
        }
    }
    //! TypeError handling
    t(variables, expectedTypes, options = { object: "default" }) {
        if (Array.isArray(expectedTypes)) {
            let variablesTypes = variables.map((variable) => JSON.stringify(getType(variable, options)));
            let parsedExpectedTypes = expectedTypes.map((type) => JSON.stringify(parseType(type)));
            let variablesTypesStringified = variablesTypes.map((variables) => parseTypeForString(JSON.parse(variables)));
            let expectedTypesStringified = parsedExpectedTypes.map((variables) => parseTypeForString(JSON.parse(variables)));
            for (let i = 0; i < expectedTypes.length; i++) {
                if (variablesTypes[i] !== parsedExpectedTypes[i]) {
                    let pos = (i + 1).toString();
                    let suffix = pos.endsWith("1")
                        ? "st"
                        : pos.endsWith("2")
                            ? "nd"
                            : pos.endsWith("3")
                                ? "rd"
                                : "th";
                    ADP.error = new Error(`Expected the ${(i + 1).toString() + suffix} input to be of type ${expectedTypesStringified[i]} but got ${variablesTypesStringified[i]} instead`);
                    ADP.error.name = "TypeError";
                    ADP.error.stack = ADP.error.stack ? ADP.error.stack : undefined;
                    throw ADP.error;
                }
            }
        }
        else {
            let variablesTypes = JSON.stringify(getType(variables, options));
            let parsedExpectedTypes = JSON.stringify(parseType(expectedTypes));
            let variablesTypesStringified = parseTypeForString(JSON.parse(variablesTypes));
            let expectedTypesStringified = parseTypeForString(JSON.parse(parsedExpectedTypes));
            if (variablesTypes !== parsedExpectedTypes) {
                ADP.error = new Error(`Expected the input to be of type ${expectedTypesStringified} but got ${variablesTypesStringified} instead`);
                ADP.error.name = "TypeError";
                ADP.error.stack = ADP.error.stack ? ADP.error.stack : undefined;
                throw ADP.error;
            }
        }
    }
    //? Validation
    isValidDay(day, month, year) {
        this.t([day, month, year], ["number", "number", "number"]);
        const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
        const monthsWith30Days = [4, 6, 9, 11];
        console.log("debug", month);
        return (Number.isInteger(day) &&
            day >= 1 &&
            (monthsWith31Days.includes(month)
                ? day <= 31
                : monthsWith30Days.includes(month)
                    ? day <= 30
                    : month === 2
                        ? this.e(this, "isYearBissextile", year, {
                            name: "InputError",
                            message: "Input year is invalid",
                        })
                            ? day <= 29
                            : day <= 28
                        : false));
    }
    isValidMonth(month) {
        this.t(month, "string|number");
        const validMonths = [
            "jan",
            "janv",
            "janvier",
            "january",
            "fev",
            "feb",
            "fevrier",
            "f??vrier",
            "february",
            "mar",
            "mars",
            "march",
            "avr",
            "apr",
            "avril",
            "april",
            "mai",
            "may",
            "jun",
            "juin",
            "june",
            "jul",
            "juillet",
            "july",
            "aug",
            "aout",
            "ao??t",
            "august",
            "sep",
            "sept",
            "septembre",
            "september",
            "oct",
            "octobre",
            "october",
            "nov",
            "novembre",
            "november",
            "dec",
            "decembre",
            "d??cembre",
            "december",
        ];
        return typeof month === "number"
            ? month >= 1 && month <= 12 && Number.isInteger(month)
            : validMonths.includes(month.toLowerCase());
    }
    isValidYear(year) {
        this.t(year, "number");
        return year >= 0 && Number.isInteger(year);
    }
    //? Utils
    isYearBissextile(year) {
        this.e(this, "isValidYear", year, {
            name: "InputError",
            message: "Input year is invalid",
        });
        return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    }
}
