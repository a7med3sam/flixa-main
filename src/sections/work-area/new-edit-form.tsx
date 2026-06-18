'use client';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { paths } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { WorkArea } from 'src/types/work-area';
import { endpoints } from 'src/utils/endpoints';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFMap from 'src/components/hook-form/rhf-map';
import { FetchTags } from 'src/actions/config-actions';
import RHFSwitch from 'src/components/hook-form/rhf-switch';
import { postData, editData } from 'src/utils/crud-fetch-api';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { Box, Card, Stack, Grid2, Button } from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

type Props = {
  workDetails?: WorkArea;
};

const schema = yup.object().shape({
  latitude: yup.number().required('validation.required'),
  longitude: yup.number().required('validation.required'),
  radiusInMeters: yup.number().positive().required('validation.required'),
  nameAr: yup.string().required('validation.required'),
  nameEn: yup.string().required('validation.required'),
  isActive: yup.boolean().required('validation.required'),
});

export default function WorkAreaForm({ workDetails }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      latitude: workDetails?.latitude ?? 30.0444,
      longitude: workDetails?.longitude ?? 31.2357,
      nameAr: workDetails?.nameAr ?? '',
      nameEn: workDetails?.nameEn ?? '',
      radiusInMeters: workDetails?.radiusInMeters ?? 0,
      isActive: workDetails?.isActive || false,
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
    };
    try {
      if (workDetails) {
        const res = await editData(endpoints.workArea.patch(workDetails.id), 'PATCH', payload);
        if ('error' in res) throw new Error(res.error);
        enqueueSnackbar(
          t('Global.Server.Success.var_updated', { var: t('Pages.WorkArea.name_area') })
        );
      } else {
        const res = await postData(endpoints.workArea.create, payload);
        if ('error' in res) throw new Error(res.error);
        enqueueSnackbar(
          t('Global.Server.Success.var_created', { var: t('Pages.WorkArea.name_area') })
        );
      }
      invalidateTag(FetchTags.WorkArea);
      router.push(paths.controlPanel.workArea.list);
    } catch (error: any) {
      enqueueSnackbar(error.message || t('Global.Server.Error.generic'), { variant: 'error' });
    }
  });
  return (
    <FormProvider methods={methods}>
      <Card sx={{ p: 3, mt: 3 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{xs:12,sm:6}}>
            <RHFTextField name="nameAr" label={t('Global.Label.name_ar')} />
          </Grid2>
          <Grid2 size={{xs:12,sm:6}}>
            <RHFTextField name="nameEn" label={t('Global.Label.name_en')} />
          </Grid2>
          <Grid2 size={{xs:12,sm:6}}>
            <RHFTextField
              name="radiusInMeters"
              label={t('Pages.WorkArea.avaliable_space')}
              type="number"
            />
          </Grid2>
           <Grid2 size={{xs:12,sm:6}}>
            <Box sx={{ mt:4 }} >
            <RHFSwitch name="isActive" label={t('Global.Label.status')} />
            </Box>
          </Grid2>
        </Grid2>

        <Box mt={4}>
          <RHFMap
            label=""
            defaultCenter={{ lat: watch('latitude'), lng: watch('longitude') }}
            defaultZoom={14}
            markerPosition={{ lat: watch('latitude'), lng: watch('longitude') }}
            onMapClick={({ lat, lng }) => {
              setValue('latitude', lat);
              setValue('longitude', lng);
            }}
          />
        </Box>

        <Stack direction="row" spacing={1} mt={3} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => router.push(paths.controlPanel.workArea.list)}>
            {t('Global.Action.cancel')}
          </Button>
          <LoadingButton variant="contained" loading={isSubmitting} onClick={onSubmit}>
            {t('Global.Action.save')}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
