'use client';

import { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { endpoints } from 'src/utils/endpoints';
import { DatePicker } from '@mui/x-date-pickers';
import { postData } from 'src/utils/crud-fetch-api';
import { useForm, Controller } from 'react-hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  Card,
  Grid2,
  Switch,
  MenuItem,
  Container,
  TextField,
  CardContent,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

// -------------------------------
// Types
// -------------------------------
interface CouponFormValues {
  code: string;
  discount: number | undefined;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  numberOfUsagesNow: number | undefined;
  isActive: boolean;
  type: number | '';
}

// -------------------------------
// Component
// -------------------------------
export default function CreateCouponPage() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const t = useTranslations();

  // Labels
  const labels = {
    startDate: t('Pages.Banners.start_date'),
    endDate: t('Pages.Banners.end_date'),
    status: t('Global.Label.status'),
    discountValue: t('Pages.DiscountCodes.discount_value'),
    numberOfUsages: t('Pages.DiscountCodes.current_uses'),
    code: t('Pages.DiscountCodes.code'),
    type_discount: t('Pages.DiscountCodes.type_discount'),
    percantage: t('Pages.DiscountCodes.percantage'),
    values: t('Pages.DiscountCodes.values'),
  };

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<CouponFormValues>({
    mode: 'onChange',
    defaultValues: {
      code: '',
      discount: 1,
      startDate: null,
      endDate: null,
      numberOfUsagesNow: undefined,
      isActive: true,
      type: 1,
    },
  });

  // Watch the type to adjust validation
  const watchType = watch('type');

  // Custom validation for discount based on current type
  const validateDiscount = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return 'Discount is required';
    }

    if (value <= 0) {
      return t('Global.Validation.var_min', { var: t('Pages.DiscountCodes.discount_value'), min: 1 });
    }

    // Only apply 100 limit for Percentage type (1)
    if (watchType === 1 && value > 100) {
      return t('Pages.DiscountCodes.percentage_limit_validation');
    }

    // For Values type (2), no upper limit - can be any positive number
    return true;
  };

 // Re-validate discount when type changes
  useEffect(() => {
    if (watchType) {
      // Clear existing discount errors first
      clearErrors('discount');

      // Trigger re-validation of discount field
      setTimeout(() => {
        trigger('discount');
      }, 0);
    }
  }, [watchType, clearErrors, trigger]);

  // Handle type change with proper validation
  const handleTypeChange = async (newType: number | '') => {
    const currentDiscount = watch('discount');

    // If switching to percentage and current discount > 100, reset it
    if (newType === 1 && currentDiscount && currentDiscount > 100) {
      setValue('discount', undefined);
      enqueueSnackbar(t('Pages.DiscountCodes.discount_reset_percentage'), {
        variant: 'warning',
        autoHideDuration: 3000
      });
    }

    setValue('type', newType);

    // Re-validate after type change
    setTimeout(() => {
      trigger('discount');
    }, 0);
  };

  // Submit handler
  const onSubmit = async (data: CouponFormValues) => {
    // Manual validation before submit
    const discountError = validateDiscount(data.discount);
    if (discountError !== true) {
      enqueueSnackbar(discountError, { variant: 'error' });
      return;
    }

    const payload = {
      ...data,
      startDate: data.startDate?.toISOString(),
      endDate: data.endDate?.toISOString(),
    };

    try {
      const res = await postData(endpoints.barcodeDiscount.create, payload);

      if ('error' in res) {
        enqueueSnackbar(res.error, { variant: 'error' });
        return;
      }

      enqueueSnackbar(
        t('Global.Server.Success.var_created', {
          var: t('Pages.DiscountCodes.this_discount'),
        }),
        { variant: 'success' }
      );

      reset();
      router.push(paths.controlPanel.marketings.barcodeDiscount.list);
    } catch (err: any) {
      enqueueSnackbar(err.message || 'An error occurred', { variant: 'error' });
    }
  };

  // Get appropriate discount validation message
  const getDiscountHelperText = () => {
    if (errors.discount) {
      return errors.discount.message;
    }
    if (watchType === 1) {
      return t('Pages.DiscountCodes.percentage_validation');
    }
    return t('Pages.DiscountCodes.fixed_amount_validation');
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <CustomBreadcrumbs
        heading={t('Pages.DiscountCodes.new_coupon')}
        links={[
          {
            name: t('Nav.Marketing.coupons'),
            href: paths.controlPanel.marketings.barcodeDiscount.list,
          },
          { name: t('Pages.DiscountCodes.new_coupon') },
        ]}

        actions={[
          {
            children: t('Global.Action.cancel'),
            variant: 'outlined',
            onClick: () => router.push(paths.controlPanel.marketings.barcodeDiscount.list),
            sx: { minWidth: 120, maxWidth: '100%' },
          },
          {
            children: t('Global.Action.save'),
            variant: 'contained',
            disabled: !isValid,
            onClick: handleSubmit(onSubmit),
            sx: { minWidth: 120, maxWidth: '100%' },
          },
        ]}
        activeLast
      />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>
              {/* Code */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="code"
                  control={control}
                  rules={{
                    required: 'Code is required',
                    pattern: {
                      value: /^[a-zA-Z0-9]{4}$/,
                      message: 'Code must be exactly 4 letters or numbers'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={labels.code}
                      error={!!errors.code}
                      helperText={errors.code?.message}
                      value={field.value || ''}
                    />
                  )}
                />
              </Grid2>

              {/* Number of Usages */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="numberOfUsagesNow"
                  control={control}
                  rules={{
                    required: 'Number of usages is required',
                    min: {
                      value: 1,
                      message: 'Number of usages must be greater than 0'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={labels.numberOfUsages}
                      type="number"
                      error={!!errors.numberOfUsagesNow}
                      helperText={errors.numberOfUsagesNow?.message}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const {value} = e.target;
                        field.onChange(value === '' ? undefined : Number(value));
                      }}
                    />
                  )}
                />
              </Grid2>

              {/* Start Date */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label={labels.startDate}
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid2>

              {/* End Date */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: 'End date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label={labels.endDate}
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid2>

              {/* Type */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Type is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label={labels.type_discount}
                      value={field.value || ''}
                      onChange={(e) =>
                        handleTypeChange(Number(e.target.value) as 1 | 2)
                      }
                      error={!!errors.type}
                      helperText={errors.type?.message}
                    >
                      <MenuItem value={1}>{labels.percantage}</MenuItem>
                      <MenuItem value={2}>{labels.values}</MenuItem>
                    </TextField>
                  )}
                />
              </Grid2>

              {/* Discount */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="discount"
                  control={control}
                  rules={{
                    required: 'Discount is required',
                    validate: validateDiscount
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label={
                        watchType === 1
                          ? `${labels.discountValue} (%)`
                          : labels.discountValue
                      }
                      error={!!errors.discount}
                      helperText={getDiscountHelperText()}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const {value} = e.target;
                        const numValue = value === '' ? undefined : Number(value);
                        field.onChange(numValue);
                      }}
                      onBlur={() => trigger('discount')}
                      InputProps={{
                        endAdornment:
                          watchType === 1 ? (
                            <InputAdornment position="end">%</InputAdornment>
                          ) : null,
                      }}
                    />
                  )}
                />
              </Grid2>

              {/* Status */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  }
                  label={labels.status}
                />
              </Grid2>
            </Grid2>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}