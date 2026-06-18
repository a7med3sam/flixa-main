import { ApiResponse } from 'src/types/order';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { Drivers, DriverStatus } from 'src/types/driver';
import DriverListView from 'src/sections/drivers/views/list-view';

interface Props {
  searchParams: Promise<Record<'page' | 'limit' | 'search' |'registerDate'|'status',string | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, search, registerDate,status} = await searchParams;
  page = page || '1';
  limit = limit || '5';
  const urlSearchParams = new URLSearchParams({
    SkipCount: `${(Number(page) - 1) * Number(limit)}`,
    MaxResultCount: limit,
    ...(registerDate && { RegistrationDate: registerDate }),
    ...(search && { Search: search }),
    ...(status && { Status: status }),

  });

  const driverList = await getData<{ totalCount: number; items: Drivers[] }>(
    `${endpoints.drivers.list}?${urlSearchParams.toString()}`,
  );

  if ('error' in driverList) {
    if(driverList.status === 403) {
        return <NoPermissionView />;
      }
    throw new Error(driverList.error);
  }
   const totalStatus = await getData<ApiResponse<DriverStatus>>(endpoints.drivers.count);
 
   if ('error' in totalStatus) {
     throw new Error(totalStatus.error);
   }
   
   const { data: totalOrderStatus } = totalStatus;
  return (
    <DriverListView 
    total={totalOrderStatus}
     driversList={driverList?.data?.items}
     totalCount={driverList?.data?.totalCount}
    />
  );  
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.Drivers' });
  
    return {
      title: t('title'),
    };
  }
   
