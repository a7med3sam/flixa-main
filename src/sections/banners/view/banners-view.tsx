'use client';
import React from 'react';
import { paths } from 'src/routes/paths';
import { Banner } from 'src/types/banner';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BannersTable from '../banners-table';
import BannerStatusFilter from '../banner-filter-status';

interface Props {
  items: Banner[];
  totalCount: number;
}

export default function BannersView({ items, totalCount }: Props) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Nav.Marketing.banners')}
        links={[{}]}
        actions={[
          {
            children: t('Global.Action.add'),
            onClick: () => router.push(paths.controlPanel.marketings.banners.new),
          },
        ]}
      />
      <Card>
        <BannerStatusFilter />
        <BannersTable items={items} totalCount={totalCount} />
      </Card>
    </Container>
  );
}
