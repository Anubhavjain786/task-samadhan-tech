import moment from 'moment';

export function getCurrentTimestamp(
  date?: Date,
  format: string = 'YYYY-MM-DD HH:mm:ss',
) {
  if (date) {
    return moment(date).format(format);
  } else {
    return moment().format(format);
  }
}

export function getIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDate(date: Date, delimitter = '-'): string {
  return (
    date.getFullYear().toString().padStart(2, '0') +
    delimitter +
    (date.getUTCMonth() + 1).toString().padStart(2, '0') +
    delimitter +
    date.getDate().toString().padStart(2, '0')
  );
}

export function getTime(date: Date, delimitter = '-'): string {
  return (
    date.getHours().toString().padStart(2, '0') +
    delimitter +
    date.getMinutes().toString().padStart(2, '0') +
    delimitter +
    date.getSeconds().toString().padStart(2, '0')
  );
}

export function dateToTz(date: Date, timeZone: string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.toLocaleString('en-US', { timeZone }));
}

export function timestampForHuman(date: string | Date): string {
  return moment(date).format('ll LT');
}

export function dateForHuman(date: string | Date): string {
  return moment(date).format('ll');
}
