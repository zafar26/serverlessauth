import { utcToZonedTime, format } from "date-fns-tz";

// takes direct value from query and and returns as Jul 29, 2020 4:54 PM
export const getIndianTime = (utc, timezone = "Asia/Kolkata") => {
    const date = new Date(utc);
    const timeZone = timezone;
    const zonedTime = utcToZonedTime(date, timeZone);
    const pattern = "PP p";
    const output = format(zonedTime, pattern);
    return output;
};
