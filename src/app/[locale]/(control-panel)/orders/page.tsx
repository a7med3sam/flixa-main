import { Drivers } from 'src/types/driver';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { ApiResponse } from 'src/types/crud-types';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import OrderListView from 'src/sections/orders/view/list-view';
import { Order, OrderStatus, PaymentMethodsApiResponse } from 'src/types/order';

interface Props {
  searchParams: Promise<Record<'page' | 'limit' | 'status' |'PaymentMethodId'|'OrderId'|'OrderDate',string | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, status, PaymentMethodId,OrderId,OrderDate} = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || '5',
    PaymentMethodId:PaymentMethodId || '',
    OrderId:OrderId ||'',
    OrderDate:OrderDate||'',
    ...(status && { Status: status }),
  });

  const orderList = await getData<{ totalCount: number; items: Order[] }>(
    `${endpoints.order.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.OrderList] }
  );

  if ('error' in orderList) {
    if(orderList.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(orderList.error);
  }
  const paymentMethodItems = await getData<PaymentMethodsApiResponse>(
    `${endpoints.paynentMethod.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.PaymentMethod] }
  );
  
  if ('error' in paymentMethodItems) {
    if(paymentMethodItems.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(paymentMethodItems.error);
  }

 const driverList = await getData<{ totalCount: number; items: Drivers[] }>(
    endpoints.drivers.list
  );

  if ('error' in driverList) {
    throw new Error(driverList.error);
  }  
  const totalStatus = await getData<ApiResponse<OrderStatus>>(endpoints.order.count);

  if ('error' in totalStatus) {
    throw new Error(totalStatus.error);
  }
  
  const { data: totalOrderStatus } = totalStatus;
  
  return (
    <OrderListView 
      total={totalOrderStatus}
      orders={orderList?.data?.items}
      totalCount={orderList.data.totalCount}
      paymentMethod={paymentMethodItems?.data?.data?.items}
      drivers={driverList.data.items}
    />
  );  
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Orders' });

  return {
    title: t('title'),
  };
}
