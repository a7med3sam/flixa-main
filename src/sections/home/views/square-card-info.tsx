'use client';

import React from 'react';
import Grid from '@mui/material/Grid2';
import { ICONS } from 'src/config-icons';
import { Reports } from 'src/types/home';
import { useTranslations } from 'next-intl';

import CardItem from './card-item-component';

interface Props {
  items: Reports;
}

export default function SquareCardItems({ items }: Props) {
  const t = useTranslations();

  return (
    <Grid container spacing={2}>
      {/* Clients */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
        <CardItem
          value={items.totalClients}
          label={t('Nav.Users.clients')}
          icon={ICONS.navbar.users}
        />
      </Grid>

      {/* Drivers */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
        <CardItem
          value={items.totalDrivers}
          label={t('Nav.Users.drivers')}
          icon={ICONS.global.drivers}
        />
      </Grid>

      {/* Orders */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
        <CardItem
          value={items.totalOrders}
          label={t('Pages.Reports.orders')}
          icon={ICONS.navbar.orders}
        />
      </Grid>

      {/* Free Shipping Orders */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
        <CardItem
          value={items.totalOrdersFreeShoppingCost}
          label={t('Pages.Home.free_shipping_orders')}
          icon={ICONS.navbar.products}
        />
      </Grid>
    </Grid>
  );
}
