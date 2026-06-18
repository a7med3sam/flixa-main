'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { PaymentMethod } from 'src/types/order';
import { Card, Stack, Container } from '@mui/material';
import { Report, ReportOrder } from 'src/types/report';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CardInfoSquare from './card-info';
import ReportsOrderTable from '../list-table';
import DateRangeFilter from '../filters/filters_by_range';
import ListFilterReportOrders from '../filters/list-filter';

interface Props {
  reports: Report;
  orderReports: ReportOrder[];
  paymentMethod: PaymentMethod[];
  totalCount: number;
}

export default function ReportsView({ reports, orderReports,paymentMethod, totalCount }: Props) {
  const t = useTranslations();
  
  return (
    <Container>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
      <CustomBreadcrumbs
        heading={t('Nav.reports')}
        links={[]}
      />
      <DateRangeFilter />
      </Stack>

      <CardInfoSquare items={reports} />
      <Card sx={{ my: 2 }}>
        <ListFilterReportOrders items={orderReports} paymentMethodItems={paymentMethod} />
        <ReportsOrderTable items={orderReports} totalCount={totalCount} />
      </Card>
    </Container>
  );
}
