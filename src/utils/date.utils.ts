export const mapDateTimeStringToTime = (date: Date) => new Date(date).toLocaleTimeString().slice(0, -3);

export const mapDateTimeStringToYear = (date: Date) => new Date(date).toISOString().slice(0, -14);

export const mapTimeToDateTimeString = (time: string) => `2022-06-21T${time}:00`;
