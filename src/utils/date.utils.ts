export const mapDateTimeStringToTime = (date: Date) => new Date(date).toISOString().slice(11, -8);

export const mapDateTimeStringToDate = (dateString: Date) => { 
  const date = new Date(dateString);
  return `${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getFullYear()}`;
};

export const mapDateTimeStringToYear = (date: Date) => new Date(date).toISOString().slice(0, -14);

export const mapTimeToDateTimeString = (time: string) => `2022-06-21T${time}:00`;

export const mapDateToDayNumber = (date: Date): number => {
  const hourString = mapDateTimeStringToTime(date);
  return +(hourString.slice(0, 2) + hourString.slice(3));
};
