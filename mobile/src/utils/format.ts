import dayjs from 'dayjs';

export function formatCurrency(amount: number, currency: string = 'UZS'): string {
  const formatted = Math.abs(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = amount < 0 ? '-' : '';
  return `${sign}${formatted} ${currency}`;
}

export function formatDate(date: string): string {
  return dayjs(date).format('DD MMM YYYY');
}

export function formatShortDate(date: string): string {
  return dayjs(date).format('MMM DD');
}

export function formatMonth(month: number, year: number): string {
  return dayjs().month(month - 1).year(year).format('MMMM YYYY');
}
