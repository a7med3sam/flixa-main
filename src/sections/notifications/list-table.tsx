import React, { useMemo } from 'react';
import { Drivers } from 'src/types/driver';
import { useTranslations } from 'next-intl';
import { Clients } from 'src/types/clients';
import { fDate } from 'src/utils/format-time';
import { useQuery } from 'src/components/use-query';
import { Notifications } from 'src/types/notifications';
import SharedTable from 'src/components/SharedTable/SharedTable';

interface Props {
  items?: Notifications[];
  totalCount: number;
  clients: Clients[];
  drivers: Drivers[];
}

const DEFAULT_NOTIFICATION_LABEL = 'Pages.Notification.all';

export default function NotificationTable({
  items ,
  totalCount,
  clients,
  drivers,
}: Props) {
  const t = useTranslations();
  const { values: { UserRole } } = useQuery(['UserRole'], true);

  const getUserDisplayName = (userId: string) => {
    const client = clients.find(c => c.id === userId);
    const driver = drivers.find(d => d.id === userId);
    return client?.name || driver?.name || t(DEFAULT_NOTIFICATION_LABEL);
  };

  const TABLE_HEAD = useMemo(() => [
    { id: 'title', label: 'Pages.Notification.title' },
    { id: 'body', label: 'Pages.Notification.body' },
    { id: 'creationTime', label: 'Pages.Notification.date' },
    { 
      id: 'user',
      label: UserRole === 'Driver' 
      ?'Pages.Orders.driver_name'
        : 'Pages.Orders.client_name' 
    },
  ], [UserRole]);

   const customRender: Record<string, (item: Notifications) => React.ReactNode> = useMemo(
     () => ({
    title: (item: Notifications) => item.title,
    body: (item: Notifications) => item.body,
    creationTime: (item: Notifications) => fDate(item.creationTime, 'dd-MM-yyyy'),
    user: (item: Notifications) => getUserDisplayName(item.userId),
  }), [],);

  return (
    <SharedTable
      tableHead={TABLE_HEAD}
     data={items || ([] as any)}
      count={totalCount}
      customRender={customRender}
    />
  );
}
