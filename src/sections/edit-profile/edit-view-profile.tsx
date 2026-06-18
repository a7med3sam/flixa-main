'use client';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useAuthStore } from 'src/auth/auth-store';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field';
import { Button, Grid2, Typography } from '@mui/material';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';

export default function EditViewProfile() {
  const t = useTranslations();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const labels = {
    profileImage: t('Global.Label.profile_image'),
    name: t('Global.Label.name'),
    email: t('Global.Label.email'),
    phoneNumber: t('Global.Label.phone'),
    basicData: t('Global.Label.basic_data'),
  };

  const methods = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      profileImage: null,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    updateProfile({
      name: data.name || '',
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
    });
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              {labels.basicData}
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <RHFUploadAvatar name="profileImage" />
            </Box>

            <RHFTextField name="name" label={labels.name} fullWidth sx={{ mb: 2 }} />
            <RHFTextField name="phoneNumber" label={labels.phoneNumber} fullWidth sx={{ mb: 2 }} />
            <RHFTextField name="email" label={labels.email} fullWidth sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {t('Global.Label.save_data')}
            </Button>
          </Card>
        </Grid2>
      </Grid2>
    </FormProvider>
  );
}
