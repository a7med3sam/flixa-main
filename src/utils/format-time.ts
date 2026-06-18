import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function isBetween(inputDate: Date | string | number, startDate: Date, endDate: Date) {
  const date = new Date(inputDate);

  const results =
    new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
    new Date(date.toDateString()) <= new Date(endDate.toDateString());

  return results;
}

export function isAfter(startDate: Date | null, endDate: Date | null) {
  const results =
    startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

  return results;
}

export function useFormat() {
  const t = useTranslations();

  const formateDate = (date: InputValue, newFormat?: string) => {
    const fm = newFormat || 'dd MMM yyyy';

    return date
      ? format(new Date(date), fm).replace(
          /January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|AM|PM/g,
          (matched) => t(`Global.Date.${matched.toLocaleLowerCase().slice(0, 3)}`)
        )
      : '';
  };

  const formateTime = (date: InputValue, newFormat?: string) => {
    const fm = newFormat || 'p';

    return date
      ? format(new Date(date), fm).replace(/AM|PM/g, (matched) =>
          t(`Global.Date.${matched.toLocaleLowerCase()}`)
        )
      : '';
  };

  return { formateDate, formateTime };
}

export async function getFormate() {
  const t = await getTranslations();

  const formateDate = (date: InputValue, newFormat?: string) => {
    const fm = newFormat || 'dd MMM yyyy';

    return date
      ? format(new Date(date), fm).replace(
          /January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/g,
          (matched) => t(`Global.Date.${matched.toLocaleLowerCase().slice(0, 3)}`)
        )
      : '';
  };

  const formateTime = (date: InputValue, newFormat?: string) => {
    const fm = newFormat || 'p';

    return date
      ? format(new Date(date), fm).replace(/AM|PM/g, (matched) =>
          t(`Global.Date.${matched.toLocaleLowerCase()}`)
        )
      : '';
  };

  return { formateDate, formateTime };
}
