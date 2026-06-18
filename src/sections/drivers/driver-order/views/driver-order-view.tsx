'use client';
import React from 'react';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { Card, Container } from '@mui/material';
import { DriverOrders, PaymentMethod } from 'src/types/order';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DriverOrderTable from '../list-table';
import ListFilterDriverOrder from '../list-filter';

interface Props {
  driverOrderDetails:DriverOrders;
  paymentMethod:PaymentMethod[];
  totalCount:number;
  driverName:string;
}
export default function DriverOrderView({driverOrderDetails,paymentMethod,totalCount,driverName}: Props) {
  const t = useTranslations();
  return (
    <Container>
      <CustomBreadcrumbs
        heading={ driverName || t('Pages.Drivers.table.name')}
        links={[
          { name: t('Nav.Users.drivers'),
            href: paths.controlPanel.users.drivers.list,
          },
        { name: driverName || t('Pages.Drivers.table.name') },
          { name: t('Pages.Orders.title') },
        ]}
      />
      <Card>
        <ListFilterDriverOrder paymentMethodItems={paymentMethod}/>
        <DriverOrderTable items={driverOrderDetails} total={totalCount} />
      </Card>
    </Container>
  );
}
