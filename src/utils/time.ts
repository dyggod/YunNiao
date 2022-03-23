function addZero(v: string | number) {
  const n = Number(v);
  if (Number.isNaN(n)) {
    return '';
  }
  if (n < 10) {
    return `0${n}`;
  }
  return String(n);
}

export function format(dateStr: string, formatStr: string = 'YYYY-MM-DD') {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  if (formatStr === 'YYYY-MM-DD') {
    return `${year}-${addZero(month + 1)}-${addZero(day)}`;
  }
  return `${year}-${addZero(month + 1)}-${addZero(day)}`;
}

export const a = 'others';
