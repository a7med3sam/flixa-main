'use client';
import React from 'react';
import { paths } from 'src/routes/paths';
import { Coupon } from 'src/types/coupons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CouponsTable from '../coupons-tabe';
import CouponsListFilters from '../list-filters';

interface Props {
  items: Coupon[];
  totalCount: number;
}
export default function CouponsView({ items, totalCount }: Props) {
  const t = useTranslations();
  const router = useRouter();
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Nav.Marketing.coupons')}
        links={[{}]}
        actions={[
          {
            children: t('Global.Action.add'),
            onClick: () => router.push(paths.controlPanel.marketings.barcodeDiscount.new),
          },
        ]}
      />
      <Card>
        <CouponsListFilters items={items} />
        <CouponsTable coupons={items} totalCount={totalCount} />
      </Card>
    </Container>
  );
}
