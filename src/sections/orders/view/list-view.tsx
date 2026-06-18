'use client';
import React from 'react';
import { Drivers } from 'src/types/driver';
import { useTranslations } from 'next-intl';
import { Card, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Order, OrderStatus, PaymentMethod } from 'src/types/order';

import OrdersTable from '../order-table';
import OrderListFilters from '../list-filters';

interface props {
  orders: Order[];
  totalCount: number;
  paymentMethod: PaymentMethod[];
  total:OrderStatus | {};
  drivers:Drivers[]
}

export default function OrderListView({ orders, totalCount, paymentMethod,total,drivers }: props) {
  const t = useTranslations();
  return (
    <Container>
      <CustomBreadcrumbs heading={t('Nav.orders')} links={[{}]} />
      <Card>
        <OrderListFilters items={orders} paymentMethodItems={paymentMethod} totalStatus={total} />
        <OrdersTable items={orders} totalCount={totalCount} drivers={drivers} />
      </Card>
    </Container>
  );
}
