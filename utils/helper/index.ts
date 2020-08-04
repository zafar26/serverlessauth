import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export const zuluNow = () => {
    dayjs.extend(utc);
    return dayjs().utc();
};

export const zuluParse = (timeString: string) => {
    dayjs.extend(utc);
    if (!timeString.includes("Z")) {
        timeString = timeString + "Z";
    }
    return dayjs(timeString);
};

export const zuluNowIsBeforeZuluParse = (timeString: string) => {
    const now = zuluNow();
    const parse = zuluParse(timeString);
    return now.isBefore(parse);
};

export const zuluNowIsAfterZuluParse = (timeString: string) => {
    const now = zuluNow();
    const parse = zuluParse(timeString);
    return now.isAfter(parse);
};

export const addSecondsToZuluNow = (seconds: number) => {
    const now = zuluNow();
    return now.add(seconds, "second");
};

export const addMinutesToZuluNow = (minutes: number) => {
    const now = zuluNow();
    return now.add(minutes, "minute");
};

export const addHoursToZuluNow = (hours: number) => {
    const now = zuluNow();
    return now.add(hours, "hour");
};

export const addDaysToZuluNow = (days: number) => {
    const now = zuluNow();
    return now.add(days, "day");
};
