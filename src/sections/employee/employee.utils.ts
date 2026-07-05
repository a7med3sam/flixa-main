export const GENDER_OPTIONS = [
  { value: '', label: 'Global.Label.all' },
  { value: 'Male', label: 'Global.Label.male' },
  { value: 'Female', label: 'Global.Label.female' },
];

export const FORM_GENDER_OPTIONS = [
  { value: 'Male', label: 'ذكر' },
  { value: 'Female', label: 'أنثى' },
];

export const STATUS_OPTIONS = [
  { value: '', label: 'Global.Label.all' },
  { value: 'true', label: 'Global.Label.active' },
  { value: 'false', label: 'Global.Label.inactive' },
];

export function getGenderLabel(gender?: string): string {
  if (gender === 'Male') return 'ذكر';
  if (gender === 'Female') return 'أنثى';
  return gender || '—';
}

export function formatDate(dateStr: string, locale = 'ar-EG'): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}
