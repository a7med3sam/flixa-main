import { Clients } from 'src/types/clients';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { DEFAULT_LIMIT } from 'src/components/constant';
import ClientsListView from 'src/sections/clients/views/list-view';


interface Props {
  searchParams: Promise<Record<'page' | 'limit' | 'search' |'createdrFilterDate'|'status',string | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, search, createdrFilterDate,status} = await searchParams;

  const urlSearchParams = new URLSearchParams({
 page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    ...(createdrFilterDate && { RegistrationDate: createdrFilterDate }),
    ...(search && { Name: search }),
    ...(status && { Status: status }),

  });
  

  const clientList = await getData<{ totalCount: number; totalBlocked: number;totalActive: number; items: Clients[] }>(
    `${endpoints.clients.list}?${urlSearchParams.toString()}`,
  );

  if ('error' in clientList) {
    if(clientList.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(clientList.error);
  }
  const totalStatus = {
    totalCount: clientList.data.totalCount,
    totalBlocked: clientList.data.totalBlocked,
    totalActive: clientList.data.totalActive,
  };
  
  return (
    <ClientsListView
        clients={clientList.data.items}
        totalStatus={totalStatus}
    />
  );  
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.Clients' });
  
    return {
      title: t('title'),
    };
  }
   
