'use client';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { Unit } from 'src/types/units';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { endpoints } from 'src/utils/endpoints';
import { yupResolver } from '@hookform/resolvers/yup';
import { FetchTags } from 'src/actions/config-actions';
import RHFSwitch from 'src/components/hook-form/rhf-switch';
import { postData, editData } from 'src/utils/crud-fetch-api';
import { invalidateTag } from 'src/actions/cache-invalidation';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Stack, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  unit?: Unit | null;
}

export default function NewEditDialog({ open, onClose, unit }: Props) {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const labels = {
    nameAr: t('Global.Label.name_ar'),
    nameEn: t('Global.Label.name_en'),
    isActive: t('Global.Label.status'),
  };

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        nameAr: Yup.string().required(t('Global.Validation.var_required', { var: labels.nameAr })),
        nameEn: Yup.string().required(t('Global.Validation.var_required', { var: labels.nameEn })),
        isActive: Yup.boolean().required(
          t('Global.Validation.var_required', { var: labels.isActive })
        ),
      })
    ),
    defaultValues: {
      nameAr: unit?.nameAr || '',
      nameEn: unit?.nameEn || '',
      isActive: unit?.isActive || false,
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) reset();
    if (open && unit) {
      setValue('nameAr', unit.nameAr);
      setValue('nameEn', unit.nameEn);
      setValue('isActive', unit.isActive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, unit]);

  const onSubmit = handleSubmit(async (data) => {
    const res = unit
      ? await editData(endpoints.units.patch(unit.id), 'PATCH', data)
      : await postData(endpoints.units.post, data);

    if ('error' in res) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        t('Global.Server.Success.var_' + (unit ? 'updated' : 'created'), {
          var: t('Global.Label.unit'),
        })
      );
      invalidateTag(FetchTags.UnitsList);
      reset();
      onClose();
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('Pages.Units.' + (unit ? 'edit_unit_title' : 'add_unit_title'))}</DialogTitle>

      <DialogContent>
        <FormProvider methods={methods}>
          <Stack spacing={2}>
            <RHFTextField
              name="nameAr"
              label={labels.nameAr}
              placeholder={labels.nameAr}
              color="primary"
              fullWidth
            />
            <RHFTextField
              name="nameEn"
              label={labels.nameEn}
              placeholder={labels.nameEn}
              color="primary"
              fullWidth
            />
            <RHFSwitch name="isActive" label={labels.isActive} />
          </Stack>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('Global.Action.cancel')}
        </Button>

        <LoadingButton variant="contained" loading={isSubmitting} onClick={onSubmit}>
          {t('Global.Action.' + (unit ? 'save' : 'create'))}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
