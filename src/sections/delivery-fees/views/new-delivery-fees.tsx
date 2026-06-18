
'use client';

import * as yup from 'yup';
import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Dialog,
  Button,
  TextField,
  IconButton,
  Typography,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface DeliveryFeeData {
  fromMeter: number;
  toMeter: number;
  cost: number;
}

interface AddDeliveryFeeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeliveryFeeData) => void;
  editData?: DeliveryFeeData | null; // <-- optional data for edit mode
}

export default function AddDeliveryFeeDialog({
  open,
  onClose,
  onSubmit,
  editData,
}: AddDeliveryFeeDialogProps) {
  const t = useTranslations();

  //  Validation Schema
  const schema = yup.object().shape({
    fromMeter: yup
      .number()
      .typeError(t('Global.Validation.validated_number'))
      .required(
        t('Global.Validation.var_required', {
          var: t('Pages.DeliveryFees.distance_from'),
        }) || 'المسافة من مطلوبة'
      )
      .min(0, t('Global.Validation.must_be_positive')),
    toMeter: yup
      .number()
      .typeError(t('Global.Validation.validated_number'))
      .required(
        t('Global.Validation.var_required', {
          var: t('Pages.DeliveryFees.distance_to'),
        })
      )
      .moreThan(yup.ref('fromMeter'), t('Global.Validation.end_distance_greater')),
    cost: yup
      .number()
      .typeError(t('Global.Validation.validated_number'))
      .required(
        t('Global.Validation.var_required', {
          var: t('Pages.DeliveryFees.fee'),
        }) || 'قيمة الرسوم مطلوبة'
      )
      .min(0, t('Global.Validation.must_be_positive')),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryFeeData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fromMeter: 0,
      toMeter: 0,
      cost: 0,
    },
  });

  //  Load data when editing
  useEffect(() => {
    if (editData) {
      reset(editData);
    } else {
      reset({ fromMeter: 0, toMeter: 0, cost: 0 });
    }
  }, [editData, reset, open]);

  const handleFormSubmit = (data: DeliveryFeeData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          backgroundColor: '#fff',
        },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1, py: 1 }}
      >
        <Typography
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            fontSize: 18,
            pr: 3,
          }}
        >
          {editData
            ? t('Pages.DeliveryFees.edit_delivery_fee') || 'تعديل رسوم التوصيل'
            : t('Pages.DeliveryFees.add_delivery_fee') || 'إضافة رسوم التوصيل'}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <Icon icon="mdi:close" />
        </IconButton>
      </Box>

      {/* Form Fields */}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Controller
          name="fromMeter"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label={t('Pages.DeliveryFees.distance_from') || 'المسافة من'}
              InputProps={{
                endAdornment: (
                  <Box sx={{ color: 'gray.600', mr: 1 }}>
                    {t('Pages.DeliveryFees.meter')}
                  </Box>
                ),
              }}
              fullWidth
              variant="filled"
              sx={{ backgroundColor: '#f5f7f5', borderRadius: 2 }}
              error={!!errors.fromMeter}
              helperText={errors.fromMeter?.message}
            />
          )}
        />

        <Controller
          name="toMeter"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label={t('Pages.DeliveryFees.distance_to') || 'المسافة إلى'}
              InputProps={{
                endAdornment: (
                  <Box sx={{ color: 'gray.600', mr: 1 }}>
                    {t('Pages.DeliveryFees.meter')}
                  </Box>
                ),
              }}
              fullWidth
              variant="filled"
              sx={{ backgroundColor: '#f5f7f5', borderRadius: 2 }}
              error={!!errors.toMeter}
              helperText={errors.toMeter?.message}
            />
          )}
        />

        <Controller
          name="cost"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label={t('Pages.DeliveryFees.fee') || 'قيمة الرسوم'}
              InputProps={{
                endAdornment: (
                  <Box sx={{ color: 'gray.600', mr: 1 }}>
                    {t('Pages.Currency.symbol')}
                  </Box>
                ),
              }}
              fullWidth
              variant="filled"
              sx={{ backgroundColor: '#f5f7f5', borderRadius: 2 }}
              error={!!errors.cost}
              helperText={errors.cost?.message}
            />
          )}
        />
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ justifyContent: 'center', gap: 2, mb: 1 }}>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          sx={{
            backgroundColor: '#2F6B3F',
            borderRadius: 2,
            px: 4,
            '&:hover': { backgroundColor: '#265E36' },
          }}
        >
          {editData
            ? t('Global.Action.edit') || 'تحديث'
            : t('Global.Action.save') || 'حفظ'}
        </Button>

        <Button
          onClick={() => {
            reset();
            onClose();
          }}
          variant="outlined"
          sx={{
            borderColor: '#2F6B3F',
            color: '#2F6B3F',
            borderRadius: 2,
            px: 4,
          }}
        >
          {t('Global.Action.cancel') || 'إلغاء'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
