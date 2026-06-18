'use client';
import { paths } from 'src/routes/paths';
import { Container } from '@mui/material';
import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { endpoints } from 'src/utils/endpoints';
import { editData } from 'src/utils/crud-fetch-api';
import { DriverDetailsType } from 'src/types/driver';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NewEditDriverForm from '../new-edit-form';

interface Props {
  driver?: DriverDetailsType;
}

export default function EditDriverView({ driver }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const onSubmit = useCallback(
    async (data: DriverDetailsType) => {
      if (!driver?.id) return;

      const formData = new FormData();

      // Personal Information
      formData.append('Name', data.name);
      formData.append('PhoneNumber', data.phoneNumber);
      formData.append('Email', data.email);
      formData.append('IdNumber', data.idNumber);
      formData.append('Address', data.address);

      // Vehicle Information
      formData.append('VehicleType', data.vehicleType);
      formData.append('Color', data.color);
      formData.append('Model', data.model);
      formData.append('LicenseNumber', data.licenseNumber);

      if (typeof data.ProfileImage !== 'string') {
        formData.append('ProfileImage', data.ProfileImage);
      }
      if (typeof data.idImageUrl !== 'string') {
        formData.append('IdImageUrl', data.idImageUrl);
      }
      if (typeof data.licenseImageUrl !== 'string') {
        formData.append('LicenseImageUrl', data.licenseImageUrl);
      }

      

      const res = await editData(endpoints.drivers.patch(driver.id), 'PUT', formData);

      if ('error' in res) {
        enqueueSnackbar(res.error, { variant: 'error' });
        return;
      } 
        enqueueSnackbar(
          t('Global.Server.Success.var_updated', {
            var: t('Nav.Users.drivers'),
          }),
          { variant: 'success' }
        );
        router.push(paths.controlPanel.users.drivers.list);
      
    },
    [driver, t, router]
  );

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        links={[
          { name: t('Nav.Users.drivers'), href: paths.controlPanel.users.drivers.list },
          { name: driver?.name ? driver.name : 'driver Name' },
          { name: t('Pages.Drivers.edit_info') },
        ]}
        heading={driver?.name}
      />

      {driver && <NewEditDriverForm driver={driver} onSubmit={onSubmit} />}
    </Container>
  );
}
