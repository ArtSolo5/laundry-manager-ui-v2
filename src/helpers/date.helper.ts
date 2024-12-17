export const convertToSQLDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatToReadable = (date: Date): string => {
  return `${date.toISOString().slice(0, 19).split('T')[0].split('-').reverse().join('.')} ${date.toISOString().slice(0, 19).split('T')[1]}`;
};

export const toKievTimeZone = (date: Date) => {
  const kievDateTime = new Date(date);
  kievDateTime.setTime(date.getTime() + 2 * 60 * 60 * 1000);
  return kievDateTime;
};
