import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Drivers } from 'src/types/driver';
import { useTranslations } from 'next-intl';
import { enqueueSnackbar } from 'notistack';
import { endpoints } from 'src/utils/endpoints';
import { editData } from 'src/utils/crud-fetch-api';
import { FetchTags } from 'src/actions/config-actions';
import { Order, OrderDetailsType } from 'src/types/order';
import { invalidateTag } from 'src/actions/cache-invalidation';
import {
  Grid2,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  items: OrderDetailsType | Order;
  drivers: Drivers[];
}

export default function EditStatusDialog({ open, onClose, items, drivers }: Props) {
  const t = useTranslations();
  const { id: orderId } = items || {};
  const [selectedDriver, setSelectedDriver] = useState<string | null>(drivers[0]?.id || null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(items?.status || null);
  const [loading, setLoading] = useState(false);

  // Status to order mapping
  const STATUS_ORDER: Record<string, number> = {
    Pending: 1,
    Processing: 2,
    Shipped: 3,
    Delivered: 4,
    Canceled: 5,
  };

  // All possible statuses
  const ALL_STATUS_OPTIONS = [
    { label: t('Pages.Orders.OrderStatus.new_order'), value: 'Pending', color: '#ffcc00' },
    { label: t('Pages.Orders.OrderStatus.in_progress'), value: 'Processing', color: '#36c' },
    { label: t('Pages.Orders.OrderStatus.out_for_delivery'), value: 'Shipped', color: '#b399ff' },
    { label: t('Pages.Orders.OrderStatus.completed'), value: 'Delivered', color: '#33cc99' },
    { label: t('Pages.Orders.OrderStatus.canceled'), value: 'Canceled', color: '#ff6666' },
  ];

  // Determine allowed status transitions
  const getAllowedStatuses = (currentStatus: string | null) => {
    if (!currentStatus) return [];

    const currentOrder = STATUS_ORDER[currentStatus];

    if (currentOrder >= 4) return []; // No changes allowed from Delivered or Canceled

    return ALL_STATUS_OPTIONS.filter((option) => {
      const targetOrder = STATUS_ORDER[option.value];
      const canCancel =
        option.value === 'Canceled' &&
        (currentStatus === 'Pending' || currentStatus === 'Processing');

      return (targetOrder > currentOrder && option.value !== 'Canceled') || canCancel;
    });
  };

  const allowedStatusOptions = getAllowedStatuses(items?.status || null);

  const handleUpdateStatus = async () => {
    if (!orderId || !selectedStatus) return;
    setLoading(true);

    const requestData = {
      id: orderId,
      status: selectedStatus,
      driverId: selectedDriver,
    };
    const res = await editData(endpoints.order.editStatus, 'PATCH', requestData);
    setLoading(false);

    if ('error' in res) {
      enqueueSnackbar(res?.error || 'Failed to update order status', { variant: 'error' });
    } else {
      enqueueSnackbar(t('Pages.Orders.order_success'), { variant: 'success' });
      onClose();
      invalidateTag(FetchTags.OrderList);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('Pages.Orders.change_order_status')}</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2} sx={{ mt: 1 }}>
          <Grid2 size={12}>
            <Autocomplete
              fullWidth
              options={allowedStatusOptions}
              value={allowedStatusOptions.find((opt) => opt.value === selectedStatus) || null}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('Pages.Orders.status')}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              onChange={(_, value) => setSelectedStatus(value?.value || null)}
              disabled={allowedStatusOptions.length === 0}
            />
          </Grid2>
          {/* here added array of static drivers */}
          {items.status=="Processing"&&
          <Grid2 size={12}>
            <Autocomplete
              fullWidth
              options={drivers}
              value={(drivers || []).find((opt) => opt.id === selectedDriver) || null}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('Pages.Orders.driver')}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              onChange={(_, value) => setSelectedDriver(value?.id || null)}
              // disabled={drivers.length === 0}
            />
          </Grid2>
           }
        </Grid2>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('Global.Action.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleUpdateStatus}
          disabled={
            !orderId ||
            !selectedStatus ||
            selectedStatus === items?.status ||
            allowedStatusOptions.length === 0
          }
        >
          {t('Global.Action.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
