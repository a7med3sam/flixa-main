'use client';
import React from 'react';
import { paths } from 'src/routes/paths';
import { Drivers } from 'src/types/driver';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Clients } from 'src/types/clients';
import { Card, Container } from '@mui/material';
import { Notifications } from 'src/types/notifications';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NotificationTable from '../list-table';
import NotificationListFilter from '../list-filters';

interface Props {
  items: Notifications[];
  totalCount: number;
  clients: Clients[];
  drivers:Drivers[];
}
export default function NotificationView({ items, totalCount, clients,drivers}: Props) {
  const t = useTranslations();
  const router = useRouter();
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Nav.Marketing.notifications')}
        links={[{}]}
        actions={[
          {
            children: t('Pages.Notification.add_notification'),
            onClick: () => router.push(paths.controlPanel.marketings.notifications.new),
          },
        ]}
      />
      <Card>
        <NotificationListFilter />
        <NotificationTable items={items} totalCount={totalCount} clients={clients} drivers={drivers}/>
      </Card>
    </Container>
  );
}
