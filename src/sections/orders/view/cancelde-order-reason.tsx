import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { ICONS } from 'src/config-icons';
import { enqueueSnackbar } from 'notistack';
import { endpoints } from 'src/utils/endpoints';
import { editData } from 'src/utils/crud-fetch-api';
import { useLocale, useTranslations } from 'next-intl';
import { FetchTags } from 'src/actions/config-actions';
import { Order, OrderDetailsType } from 'src/types/order';
import { invalidateTag } from 'src/actions/cache-invalidation';
import {
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  items: OrderDetailsType | Order;
}

export default function CancelOrderReason({ open, onClose, items }: Props) {
  const t = useTranslations();
  const locale = useLocale(); // Detects current language
  const isRTL = locale === 'ar'; // Add other RTL languages if needed

  const { id: orderId } = items || {};
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    if (!orderId || !cancelReason.trim()) return;

    const requestData = { id: orderId, status: 'Canceled', cancelReason };

    setLoading(true);
    const res = await editData(endpoints.order.editStatus, 'PATCH', requestData);
    setLoading(false);

    if ('error' in res) {
      enqueueSnackbar(res?.error || 'Failed to update order status', { variant: 'error' });
    } else {
      enqueueSnackbar(t('Pages.Orders.order_canceled_success'), { variant: 'success' });
      onClose();
      invalidateTag(FetchTags.OrderList);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Title with Close Icon Positioned Dynamically */}
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // Ensures correct spacing
          flexDirection: isRTL ? 'row-reverse' : 'row', // Swaps order in Arabic
        }}
      >
        {isRTL && (
          <Button
            onClick={onClose}
            sx={{
              minWidth: 'auto',
              padding: 0,
              color: 'red', // Adjust color if needed
            }}
          >
            {ICONS.global.x}
          </Button>
        )}
        <span>{t('Pages.Orders.cancel_order')}</span> {/* Title */}
        {!isRTL && (
          <Button
            onClick={onClose}
            sx={{
              minWidth: 'auto',
              padding: 0,
              color: 'red', // Adjust color if needed
            }}
          >
            <Typography variant="h4">{ICONS.global.x}</Typography>
          </Button>
        )}
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent>
        <Typography sx={{ textAlign: isRTL ? 'row-reverse' : 'row', mb: 2 }}>
          {t('Pages.Orders.reason')}
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={4}
          variant="outlined"
          placeholder={t('Pages.Orders.cancel_reason_placeholder')}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          sx={{
            backgroundColor: '#f5f7f7',
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left',
            '& textarea::placeholder': {
              textAlign: isRTL ? 'row-reverse' : 'row',
            },
          }}
        />
      </DialogContent>

      {/* Buttons Aligned Properly */}
      <DialogActions sx={{ justifyContent: isRTL ? 'flex-start' : 'flex-end', padding: 3 }}>
        <LoadingButton
          variant="contained"
          color="success"
          onClick={handleUpdateStatus}
          loading={loading}
          disabled={!cancelReason.trim()}
          sx={{ px: 3 }}
        >
          {t('Pages.Orders.cancel_order')}
        </LoadingButton>
        <Button variant="outlined" onClick={onClose} sx={{ px: 3 }}>
          {t('Global.Action.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
