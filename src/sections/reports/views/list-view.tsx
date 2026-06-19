'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { PaymentMethod } from 'src/types/order';
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

export default function ReportsView({ reports, orderReports, paymentMethod, totalCount }: Props) {
  const t = useTranslations();

  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="flex flex-row justify-between items-center">
        <CustomBreadcrumbs heading={t('Nav.reports')} links={[]} />
        <DateRangeFilter />
      </div>

      <CardInfoSquare items={reports} />
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-sm my-4 overflow-hidden">
        <ListFilterReportOrders items={orderReports} paymentMethodItems={paymentMethod} />
        <ReportsOrderTable items={orderReports} totalCount={totalCount} />
      </div>
    </div>
  );
}
