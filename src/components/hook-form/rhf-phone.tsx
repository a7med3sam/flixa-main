import Yup from 'yup';
import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { useCurrentLocale } from 'src/utils/locale-utils';
import { Stack, BoxProps, Typography } from '@mui/material';

export default function RHFPhone({
  name,
  label,
}: {
  name: string;
  label?: string;
} & BoxProps) {
  const { dir } = useCurrentLocale();

  return (
    <RHFTextField
      name={name}
      label={label}
      placeholder="7xx xxx xxx"
      slotProps={{
        input: {
          [dir === 'ltr' ? 'startAdornment' : 'endAdornment']: (
            <Stack
              direction="row"
              alignItems="center"
              marginInlineEnd={0.5}
              spacing={0.5}
              dir="ltr"
            >
              <Iconify icon="twemoji:flag-yemen" />
              <Typography color="text.secondary">+967</Typography>
            </Stack>
          ),
          inputProps: {
            dir: 'ltr',
            inputMode: 'numeric',
            maxLength: 9,
          },
        },
      }}
    />
  );
}

export const phoneSchema = (
  yup: typeof Yup,
  {
    required,
    onlyDigits,
    min,
    max,
    startWith,
  }: Record<'required' | 'onlyDigits' | 'min' | 'max' | 'startWith', string>
) =>
  yup
    .string()
    .required(required)
    .test('only digits', onlyDigits, (value): boolean | void => !!/^\d+$/.test(value))
    .test('start with 7', startWith, (value): boolean | void => !!value.startsWith('7'))
    .min(9, min)
    .max(9, max);
