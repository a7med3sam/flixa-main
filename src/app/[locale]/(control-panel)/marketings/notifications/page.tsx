import { Drivers } from 'src/types/driver';
import { Clients } from 'src/types/clients';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { Notifications } from 'src/types/notifications';
import NotificationView from 'src/sections/notifications/views/list-view';
interface Props {
  searchParams: Promise<
    Record<'page' | 'limit' | 'CreationDate' | 'UserRole' | 'Title', string | undefined>
  >;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, Title, CreationDate, UserRole } = await searchParams;
  page = page || '1';
  limit = limit || '5';

  const urlSearchParams = new URLSearchParams({
    SkipCount: `${(Number(page) - 1) * Number(limit)}`,
    MaxResultCount: limit,
    CreationDate: CreationDate || '',
    UserRole: UserRole || '',
    Title: Title || '',
  });

  const res = await getData<{ totalCount: number; items: Notifications[] }>(
    `${endpoints.notification.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.NotificationList] }
  );

  if ('error' in res) {
     if (res.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(res.error);
  }
  const clientList = await getData<{
    totalCount: number;
    totalBlocked: number;
    totalActive: number;
    items: Clients[];
  }>(`${endpoints.clients.list}?${urlSearchParams.toString()}`);

  if ('error' in clientList) {
    if (clientList.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(clientList.error);
  }

  const driverList = await getData<{ totalCount: number; items: Drivers[] }>(
    endpoints.drivers.list
  );

  if ('error' in driverList) {
    if (driverList.status === 403) {
      return <NoPermissionView />;
    }
     throw new Error(driverList.error);
  }
  return (
    <NotificationView
      items={res?.data?.items}
      totalCount={res?.data?.totalCount}
      clients={clientList.data.items}
      drivers={driverList?.data?.items}
    />
  );
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Notifications' });

  return {
    title: t('title'),
  };
}
