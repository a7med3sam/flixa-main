import React from 'react';
import { useTranslations } from 'next-intl';
import { OrderDetailsType } from 'src/types/order';
import { Card, Stack, TextField, Typography } from '@mui/material';

interface Props {
  initialOrderDetails: OrderDetailsType;
}

export default function NotesAndDetailsTotalOrder({ initialOrderDetails }: Props) {
  const t = useTranslations('');
  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      mt={3}
      gap={2}
      width="100%"
    >
      {/* Left Side - Notes Section (60%) */}
      <Card sx={{ width: { xs: '100%', md: '60%' }, padding: 2, borderRadius: 2 }}>
        <Stack spacing={1}>
          <Typography variant="h6" color="primary.main">
            {t('Pages.Orders.notes')}
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            value={initialOrderDetails.note ? initialOrderDetails.note : t('Pages.Orders.no_notes')}
            placeholder={t('Pages.Orders.add_notes_placeholder')}
            sx={{
              backgroundColor: '#f5f7f7',
              borderRadius: '8px',
            }}
            slotProps={{ input: { readOnly: true } }}
            disabled={!initialOrderDetails.note}
          />
        </Stack>
      </Card>
      {/* Right Side - Order Summary (40%) */}
      <Card sx={{ width: { xs: '100%', md: '40%' }, padding: 2, borderRadius: 2 }}>
        <Stack spacing={1} alignItems="end">
          {/* Total Price */}
          <Stack flexDirection="row" justifyContent="space-between" width="100%">
            <Typography color="text.secondary">{t('Pages.Orders.purchasesvalue')}</Typography>
            <Typography fontWeight="bold">{initialOrderDetails.pricing.totalPrice.toFixed(2)}{t('Pages.Currency.symbol')}</Typography>
          </Stack>

          {/* VAT */}
          <Stack flexDirection="row" justifyContent="space-between" width="100%">
            <Typography color="text.secondary">
              {t('Pages.Orders.vat_rate', { var: (initialOrderDetails.pricing.vatRate * 100).toFixed(0) })}          </Typography>
            <Typography fontWeight="bold">
              {initialOrderDetails.pricing.vatAmount.toFixed(2)} {t('Pages.Currency.symbol')}</Typography>
          </Stack>
          {/* Delivery Fee */}
          <Stack flexDirection="row" justifyContent="space-between" width="100%">
            <Typography color="text.secondary">{t('Pages.Orders.delivery_fee_with_shipping_cost')}</Typography>
            <Typography fontWeight="bold">
              {initialOrderDetails.pricing.shippingCost} {t('Pages.Currency.symbol')}</Typography>
          </Stack>
          {/* Discount */}
          <Stack flexDirection="row" justifyContent="space-between" width="100%">
            <Typography color="text.secondary">{t('Pages.Orders.discount')}</Typography>
            <Typography fontWeight="bold">{initialOrderDetails.pricing.discount} {t('Pages.Currency.symbol')}</Typography>
          </Stack>
          {/* Final Total */}
          <Stack flexDirection="row" justifyContent="space-between" width="100%">
            <Typography color="text.secondary">{t('Pages.Orders.final_total')}</Typography>
            <Typography fontWeight="bold">{initialOrderDetails.pricing.totalOrderAmount} {t('Pages.Currency.symbol')}</Typography>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
