'use client';
import * as yup from 'yup';
import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { primary } from 'src/theme/palette';
import { useRouter } from 'next/navigation';
import { DriverDetailsType } from 'src/types/driver';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';
import {
  Box,
  Card,
  Stack,
  Grid2,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

interface EditFormProps {
  driver: DriverDetailsType;
  onSubmit: (data: DriverDetailsType) => Promise<void>;
}

const vehicleTypeOptions = ['Car', 'Truck', 'Bus', 'Motorcycle', 'Van', 'Bicycle', 'Other'];

export default function EditForm({ driver, onSubmit }: EditFormProps) {
  const t = useTranslations();
  const router = useRouter();

  const labels = useMemo(
    () => ({
      name: t('Pages.Drivers.table.name'),
      email: t('Pages.Drivers.table.email'),
      phoneNumber: t('Pages.Drivers.table.phoneNumber'),
      idNumber: t('Pages.Drivers.table.idNumber'),
      address: t('Pages.Drivers.personal.address'),
      vehicleType: t('Pages.Drivers.vehicle.type'),
      color: t('Pages.Drivers.vehicle.color'),
      model: t('Pages.Drivers.vehicle.model'),
      licenseNumber: t('Pages.Drivers.vehicle.licenseNumber'),
      personalInfo: t('Pages.Drivers.images.profilePhoto'),
      vehicleInfo: t('Pages.Drivers.vehicle.vehicle_info'),
      profileImage: t('Pages.Drivers.images.profilePhoto'),
      idImageUrl: t('Pages.Drivers.images.idPhoto'),
      licenseImageUrl: t('Pages.Drivers.images.licensePhoto'),
      mainInfo: t('Pages.Drivers.main_info'),
      cancel: t('Global.Action.cancel'),
      save: t('Global.Action.save'),
      saving: t('Global.Action.save'),
    }),
    [t]
  );

  const validationSchema = yup.object().shape({
    name: yup.string().required(t('Global.Validation.var_required', { var: labels.name })),
    email: yup
      .string()
      .email(t('Global.Validation.var_invalid', { var: labels.email }))
      .required(t('Global.Validation.var_required', { var: labels.email })),
    phoneNumber: yup
      .string()
      .required(t('Global.Validation.var_required', { var: labels.phoneNumber })),
    vehicleType: yup
      .string()
      .oneOf(vehicleTypeOptions, t('Global.Validation.var_invalid', { var: labels.vehicleType }))
      .required(t('Global.Validation.var_required', { var: labels.vehicleType })),
    idNumber: yup.string().required(t('Global.Validation.var_required', { var: labels.idNumber })),
    address: yup.string().required(t('Global.Validation.var_required', { var: labels.address })),
    color: yup.string().required(t('Global.Validation.var_required', { var: labels.color })),
    model: yup.string().required(t('Global.Validation.var_required', { var: labels.model })),
    licenseNumber: yup
      .string()
      .required(t('Global.Validation.var_required', { var: labels.licenseNumber })),
    ProfileImage: yup
      .mixed<File | string>()
      .required(t('Global.Validation.var_required', { var: labels.profileImage })),
    idImageUrl: yup
      .mixed<File | string>()
      .required(t('Global.Validation.var_required', { var: labels.idImageUrl })),
    licenseImageUrl: yup
      .mixed<File | string>()
      .required(t('Global.Validation.var_required', { var: labels.licenseImageUrl })),
  });

  // Memoize default values to prevent unnecessary re-renders
  const defaultValues = useMemo(
    () => ({
      name: driver.name,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      idNumber: driver.idNumber,
      address: driver.address,
      vehicleType: driver.vehicles[0]?.vehicleType || '',
      color: driver.vehicles[0]?.color || '',
      model: driver.vehicles[0]?.model || '',
      licenseNumber: driver.vehicles[0]?.licenseNumber || '',
      ProfileImage: driver.profileImage,
      idImageUrl: driver.idImageUrl,
      licenseImageUrl: driver.vehicles[0]?.licenseImageUrl || '',
    }),
    [driver]
  );

  const methods = useForm<DriverDetailsType>({
    resolver: yupResolver(validationSchema as any),
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = methods;

  // Watch vehicleType to ensure the Select component updates correctly
  const vehicleTypeValue = watch('vehicleType');

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2} py={3} px={2}>
          {/* Left Side - Vehicle Info */}
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Card sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="h5" gutterBottom color={primary?.main}>
                  {labels.vehicleInfo}
                </Typography>
                <RHFUploadAvatar
                  name="licenseImageUrl"
                  label={labels.licenseImageUrl}
                  sx={{ width: 160, height: 120 }}
                />
                <Select
                  variant="outlined"
                  fullWidth
                  sx={{ '.MuiSelect-select': { py: 2 } }}
                  value={vehicleTypeValue || ''}
                  {...register('vehicleType')}
                  error={!!errors.vehicleType}
                >
                  <MenuItem value="" disabled>
                    {labels.vehicleType}
                  </MenuItem>
                  {vehicleTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.vehicleType && (
                  <Typography variant="caption" color="error">
                    {errors.vehicleType.message}
                  </Typography>
                )}
                <TextField
                  label={labels.licenseNumber}
                  {...register('licenseNumber')}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber?.message}
                />
                <TextField
                  label={labels.color}
                  {...register('color')}
                  error={!!errors.color}
                  helperText={errors.color?.message}
                />
                <TextField
                  label={labels.model}
                  {...register('model')}
                  error={!!errors.model}
                  helperText={errors.model?.message}
                />
              </Stack>
            </Card>
          </Grid2>

          {/* Right Side - Personal Info */}
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h5" color={primary?.main} gutterBottom>
                {labels.mainInfo}
              </Typography>
              <Stack direction="row" spacing={2} mb={2}>
                <RHFUploadAvatar
                  name="ProfileImage"
                  label={labels.profileImage}
                  sx={{ width: 120, height: 120 }}
                />
                <RHFUploadAvatar
                  name="idImageUrl"
                  label={labels.idImageUrl}
                  sx={{ width: 120, height: 120 }}
                />
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label={labels.name}
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  label={labels.phoneNumber}
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
                <TextField
                  label={labels.email}
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  label={labels.idNumber}
                  {...register('idNumber')}
                  error={!!errors.idNumber}
                  helperText={errors.idNumber?.message}
                />
                <TextField
                  label={labels.address}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Stack>
            </Card>
          </Grid2>
        </Grid2>

        {/* Submit Buttons */}
        <Grid2 container justifyContent="flex-end" px={2} mt={2}>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => router.back()}>
              {labels.cancel}
            </Button>

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? labels.saving : labels.save}
            </Button>
          </Stack>
        </Grid2>
      </Box>
    </FormProvider>
  );
}
