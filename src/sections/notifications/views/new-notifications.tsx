'use client';

import React, { useState } from 'react';
import { paths } from 'src/routes/paths';
import { Drivers } from 'src/types/driver';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { enqueueSnackbar } from 'notistack';
import { Clients } from 'src/types/clients';
import { endpoints } from 'src/utils/endpoints';
import { postData } from 'src/utils/crud-fetch-api';
import { useForm, FormProvider } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Card, Chip, Grid2, Button, Container, TextField, Autocomplete } from '@mui/material';

interface Props {
  clients: Clients[];
  drivers: Drivers[];
}

export default function NewNotificationView({ clients, drivers }: Props) {
  const t = useTranslations('');
  const router = useRouter();

  const methods = useForm();
  const { handleSubmit } = methods;

  const [selectedClients, setSelectedClients] = useState<Clients[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Drivers[]>([]);
  const [clientInputValue, setClientInputValue] = useState('');
  const [driverInputValue, setDriverInputValue] = useState('');

  const labels = {
    arTitle: t('Pages.Notification.ar_title_notification'),
    enTitle: t('Pages.Notification.eng_title_notification'),
    arContent: t('Pages.Notification.ar_content'),
    enContent: t('Pages.Notification.eng_content'),
    selectUsers: t('Pages.Notification.select_users'),
    selectDrivers: t('Pages.Notification.select_drivers'),
    selectOneRequired: t('Pages.Notification.select_at_least_one_user'),
    success: t('Pages.Notification.send_notification'),
    search: t('Global.Label.search') + '...',
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    // Add notification content
    formData.append('TitleEn', data.titleEn || '');
    formData.append('BodyEn', data.descriptionEn || '');
    formData.append('TitleAr', data.titleAr || '');
    formData.append('BodyAr', data.descriptionAr || '');

    // Combine users and drivers
    const allRecipients = [...selectedClients, ...selectedDrivers];
    if (allRecipients.length === 0) {
      enqueueSnackbar(labels.selectOneRequired, { variant: 'error' });
      return;
    }

    //  Send each UserId as a separate key-value pair
    allRecipients.forEach((user) => {
      formData.append('UserIds', user.id);
    });

    const res = await postData(endpoints.notification.postAll, formData);
    if ('error' in res) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        t('Global.Server.Success.var_created', {
          var: labels.success,
        }),
        { variant: 'success' }
      );
      router.push(paths.controlPanel.marketings.notifications.list);
    }
  };

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('Nav.Marketing.notifications')}
        links={[
          {
            name: t('Nav.Marketing.notifications'),
            href: paths.controlPanel.marketings.notifications.list,
          },
          { name: t('Pages.Notification.add_notification') },
        ]}
      />

      <Card sx={{ p: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>
              {/* Arabic/English Title */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="titleAr" label={labels.arTitle} fullWidth />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="titleEn" label={labels.enTitle} fullWidth />
              </Grid2>

              {/* Arabic/English Body */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="descriptionAr"
                  label={labels.arContent}
                  multiline
                  minRows={4}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="descriptionEn"
                  label={labels.enContent}
                  multiline
                  minRows={4}
                  fullWidth
                />
              </Grid2>

              {/* Client Selection */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  options={clients}
                  value={selectedClients}
                  onChange={(event, newValue) => {
                    setSelectedClients(newValue);
                  }}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  inputValue={clientInputValue}
                  onInputChange={(e, val) => setClientInputValue(val)}
                  filterOptions={(options, { inputValue }) =>
                    options.filter((o) => o.name?.toLowerCase().includes(inputValue.toLowerCase()))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={labels.selectUsers}
                      placeholder={labels.search}
                      fullWidth
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
                    ))
                  }
                />
              </Grid2>

              {/* Driver Selection */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  options={drivers}
                  value={selectedDrivers}
                  onChange={(event, newValue) => {
                    setSelectedDrivers(newValue);
                  }}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  inputValue={driverInputValue}
                  onInputChange={(e, val) => setDriverInputValue(val)}
                  filterOptions={(options, { inputValue }) =>
                    options.filter((o) => o.name?.toLowerCase().includes(inputValue.toLowerCase()))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={labels.selectDrivers}
                      placeholder={labels.search}
                      fullWidth
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
                    ))
                  }
                />
              </Grid2>

              {/* Submit Button */}
              <Grid2 size={{ xs: 12 }} display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" sx={{ px: 4, py: 1.5 }}>
                  {labels.success}
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </FormProvider>
      </Card>
    </Container>
  );
}
