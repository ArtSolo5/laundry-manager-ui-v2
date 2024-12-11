export const convertToSQLDate = (date: Date): string => {
  date = toKievTimeZone(date);
  return date.toISOString().split('T')[0];
};

export const formatToReadable = (date: string): string => {
  return `${date.slice(0, 19).split('T')[0].split('-').reverse().join('.')} ${date.slice(0, 19).split('T')[1]}`;
};

export const toKievTimeZone = (date: Date) => {
  date.setTime(date.getTime() + 2 * 60 * 60 * 1000);
  return date;
};
