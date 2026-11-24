// Persian date & number utilities

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  if (input === undefined || input === null) return '';
  return input
    .toString()
    .replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

export function formatToPersianDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formatter.format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    const diffHours = Math.floor((now - past) / (1000 * 60 * 60));

    if (diffHours < 1) return 'چند لحظه پیش';
    if (diffHours < 24) return `${toPersianDigits(diffHours)} ساعت پیش`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'دیروز';
    if (diffDays < 7) return `${toPersianDigits(diffDays)} روز پیش`;
    return formatToPersianDate(dateString);
  } catch {
    return 'به‌تازگی';
  }
}
