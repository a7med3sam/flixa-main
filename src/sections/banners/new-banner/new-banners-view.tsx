'use client';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
import { Banner } from 'src/types/banner';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { endpoints } from 'src/utils/endpoints';
import React, { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFSwitch from 'src/components/hook-form/rhf-switch';
import { postData, editData } from 'src/utils/crud-fetch-api';
import { RHFUpload } from 'src/components/hook-form/rhf-upload';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Card, Grid2, Container, Typography } from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// Date converts to UTC
const adjustToUTC = (dateString: string) => {
  const date = new Date(dateString);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
};

interface Props {
  banner?: Banner;
}

export default function NewEditBannerView({ banner }: Props) {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const isEdit = !!banner;

  const labels = useMemo(
    () => ({
      Url: t('Global.Label.image'),
      IsActive: t('Global.Label.status'),
      StartDate: t('Pages.Banners.start_date'),
      EndDate: t('Pages.Banners.end_date'),
    }),
    [t]
  );

  const schema = yup.object().shape({
    Url: yup
      .mixed<File | string>()
      .required(t('Global.Validation.var_required', { var: labels.Url }))
      .test('is-file', t('Global.Validation.file_required', { var: labels.Url }), (value) => {
        if (typeof value === 'string') return !!value;
        return value instanceof File;
      }),
    IsActive: yup.boolean().required(t('Global.Validation.var_required', { var: labels.IsActive })),
    StartDate: yup
      .string()
      .required(t('Global.Validation.var_required', { var: labels.StartDate }))
      .test('is-valid-date', t('Global.Validation.valid_date'), (value) => {
        if (!value) return false;
        const d = new Date(value);
        return !isNaN(d.getTime());
      }),
    EndDate: yup
      .string()
      .required(t('Global.Validation.var_required', { var: labels.EndDate }))
      .test('is-valid-date', t('Global.Validation.valid_date'), (value) => {
        if (!value) return false;
        const d = new Date(value);
        return !isNaN(d.getTime());
      })
      .test('end-after-start', t('Global.Validation.end_date_after_start'), function (value) {
        const { StartDate } = this.parent;
        if (!value || !StartDate) return true;
        return new Date(value) >= new Date(StartDate);
      }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Url: '',
      IsActive: true,
      StartDate: undefined as string | undefined,
      EndDate: undefined as string | undefined,
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (banner) {
      reset({
        Url: banner.url,
        IsActive: banner.isActive,
        StartDate: banner.startDate,
        EndDate: banner.endDate,
      });
    }
  }, [banner, reset]);

  const onSubmit = handleSubmit(async (data: Banner | any) => {
    const { Url, StartDate, EndDate, IsActive } = data;
    const formData = new FormData();

    if (Url instanceof File) {
      formData.append('Url', Url, Url.name);
    }
    formData.append('StartDate', adjustToUTC(StartDate));
    formData.append('EndDate', adjustToUTC(EndDate));
    formData.append('IsActive', IsActive.toString());

    let res;
    if (isEdit) {
      res = await editData(endpoints.banners.patch(banner!.id), 'PATCH', formData);
    } else {
      res = await postData(endpoints.banners.create, formData);
    }

    if ('error' in res) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        t(
          isEdit
            ? 'Global.Server.Success.var_updated'
            : 'Global.Server.Success.var_created',
          { var: t('Nav.Marketing.banners') }
        ),
        { variant: 'success' }
      );
      router.push(paths.controlPanel.marketings.banners.list);
    }
  });

  return (
    <>
      <Container maxWidth="xl" sx={{ my: 4 }}>
        <CustomBreadcrumbs
          links={[
            { name: t('Nav.Marketing.banners'), href: paths.controlPanel.marketings.banners.list },
            {
              name: isEdit
                ? t('Pages.Banners.edit_banner')
                : t('Pages.Banners.add_banner'),
            },
          ]}
          heading={
            isEdit
              ? t('Pages.Banners.edit_banner')
              : t('Pages.Banners.add_banner')
          }
          actions={[
            {
              children: t('Global.Action.cancel'),
              variant: 'outlined',
              onClick: () => {
                router.push(paths.controlPanel.marketings.banners.list);
              },
              sx: { minWidth: 120, maxWidth: '100%' },
            },
            {
              children: t('Global.Action.save'),
              variant: 'contained',
              onClick: () => {
                onSubmit();
              },
              sx: { minWidth: 120, maxWidth: '100%' },
            },
          ]}
        />
        <Card sx={{ mt: 3, mx: 2 }}>
          <FormProvider methods={methods}>
            <Grid2 container spacing={2} size={{ xs: 12, sm: 8, 12: 6 }}>
              <Grid2 size={{ xs: 6, sm: 6 }} spacing={2} sx={{ p: 3 }}>
                <RHFUpload name="Url" label={''} sx={{ marginInlineStart: 0, width: '100%' }} />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 6 }}>
                <Grid2 size={12} spacing={3} sx={{ px: 3 }}>
                  <Typography sx={{ minWidth: 75, my: 2 }} variant="h6">
                    {labels.StartDate}
                  </Typography>
                  <RHFTextField
                    name="StartDate"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 1 }}
                  />
                  <Typography sx={{ minWidth: 75, my: 2 }} variant="h6">
                    {labels.EndDate}
                  </Typography>
                  <RHFTextField
                    name="EndDate"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 1 }}
                    fullWidth
                  />
                  <Grid2 size={{ xs: 12, sm: 6 }} sx={{ my: 2 }}>
                    <RHFSwitch
                      name="IsActive"
                      label={labels.IsActive}
                      sx={{ justifyContent: 'space-between', width: '100%' }}
                    />
                  </Grid2>
                </Grid2>
                <Grid2 size={12}></Grid2>
              </Grid2>
            </Grid2>
          </FormProvider>
        </Card>
      </Container>
    </>
  );
}
