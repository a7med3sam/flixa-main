'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';

export default function ProductFormAction(props: LoadingButtonProps) {
  const t = useTranslations();
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <LoadingButton type="submit" loading={isSubmitting} variant="contained" {...props}>
      {t('Global.Action.save')}
    </LoadingButton>
  );
}
