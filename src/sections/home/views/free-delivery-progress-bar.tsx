
import React, { useState } from 'react';
import { primary } from 'src/theme/palette';
import { useTranslations } from 'next-intl';
import { Reports, SettingItem } from 'src/types/home';
import { Box, Paper, Button, Typography, CircularProgress } from '@mui/material';

import EditFreeShippingDialog from './edit-free-shipping-dialog';

interface Props {
  reports: Reports;
  freeShipping: SettingItem[];
}

export default function DeliveryFreeProgress({ reports, freeShipping }: Props) {
  const t = useTranslations();
  const { totalOrders } = reports;
  const totalFreeShippingOrders = reports.totalOrdersFreeShoppingCost;
  const paidDeliveryOrders = totalOrders - totalFreeShippingOrders;

  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Extract both items dynamically
  const shippingItem = freeShipping.find((item) => item.nameEn === 'Shipping Cost');
  const vatItem = freeShipping.find((item) => item.nameEn === 'Vat Percentage');
  const minOrderAmountItem = freeShipping.find((item) => item.nameEn === 'Minimum Order Amount');
  const freeDeliveryThreshold = shippingItem?.value || '0';
  const vatPercentage = vatItem?.value || '0';
  const minOrderAmount = minOrderAmountItem?.value || '0';

  // ✅ Calculate percentages
  const freeShippingPercentage =
    totalOrders > 0 ? Math.round((totalFreeShippingOrders / totalOrders) * 100) : 0;

  const paidDeliveryPercentage = 100 - freeShippingPercentage;

  return (
    <>
<Paper
  elevation={0}
  sx={{
    p: 3,
    borderRadius: 3,
    width: '100%',
    border: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',

    // 🔥 Responsive Layout
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'center', md: 'center' },
    justifyContent: { xs: 'center', md: 'space-between' },
    gap: { xs: 3, md: 0 },
  }}
>
  {/* ================= LEFT BUTTON ================= */}
  <Box
    sx={{
      order: { xs: 3, md: 1 },
      width: { xs: '100%', md: 'auto' },
      display: 'flex',
      justifyContent: { xs: 'center', md: 'flex-start' },
    }}
  >
    <Button
  sx={{
    backgroundColor: '#ABBFAB40',
    color: primary.main,
    borderRadius: '16px',
    padding: '6px 12px',
    fontWeight: 500,
    fontSize: '0.80rem',
    textTransform: 'none',
    boxShadow: 'none',

    // ⭐ NEW — limit width + wrap text
    maxWidth: { xs: '180px', md: '200px' },
    whiteSpace: 'normal',
    lineHeight: '20px',
    textAlign: 'center',

    '&:hover': {
      boxShadow: 'none',
      backgroundColor: '#ABBFAB40',
    },
  }}
  onClick={() => setOpenDialog(true)}
>
  {t('Pages.Home.edit_free_shipping_vat')}
</Button>

  </Box>

  {/* ================= CENTER TEXT BLOCK ================= */}
  <Box
    sx={{
      order: { xs: 2, md: 2 },

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        color: '#1976d2',
        mb: 1,
      }}
    >
      ({freeShippingPercentage}%)
    </Typography>

    <Typography variant="body1" sx={{ color: '#555' }}>
      {totalFreeShippingOrders} {t('Pages.Home.free_shipping_orders')}
    </Typography>

    {/* Min free shipping */}
    <Typography sx={{ mt: 1, color: '#555', fontSize: '1rem' }}>
      {t('Pages.Home.min_free_shipping')}
    </Typography>
    <Typography sx={{ color: '#1976d2' }}>
      {freeDeliveryThreshold} {t('Pages.Currency.symbol')}
    </Typography>

    {/* VAT */}
    <Typography sx={{ mt: 1, color: '#555', fontSize: '1rem' }}>
      {t('Pages.Home.vat_percentage')}
    </Typography>
    <Typography sx={{ color: '#1976d2' }}>{vatPercentage}</Typography>

    {/* Minimum order */}
    <Typography sx={{ mt: 1, color: '#555', fontSize: '1rem' }}>
      {t('Pages.Home.minimum_order_amount')}
    </Typography>
    <Typography sx={{ color: '#1976d2' }}>{minOrderAmount}</Typography>
  </Box>

  {/* ================= RIGHT CIRCLE ================= */}
  <Box
    sx={{
      order: { xs: 1, md: 3 },

      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <CircularProgress
      variant="determinate"
      value={100}
      size={110}
      thickness={3}
      sx={{ color: '#919EAB29', position: 'absolute' }}
    />
    <CircularProgress
      variant="determinate"
      value={paidDeliveryPercentage}
      size={110}
      thickness={3}
      sx={{ color: '#5BE49B' }}
    />

    <Box
      sx={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
        {paidDeliveryPercentage}%
      </Typography>

      <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>
        {paidDeliveryOrders} {t('Pages.Home.total_orders')}
      </Typography>
    </Box>
  </Box>
</Paper>

      {/* ✅ Edit dialog */}
     <EditFreeShippingDialog
        items={freeShipping}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
