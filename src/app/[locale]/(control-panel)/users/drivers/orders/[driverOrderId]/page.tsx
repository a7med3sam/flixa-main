import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import { DriverOrders, PaymentMethodsApiResponse } from 'src/types/order';
import DriverOrderView from 'src/sections/drivers/driver-order/views/driver-order-view';

interface Props {
  params: Promise<{ driverOrderId: string }>;
  searchParams: Promise<
    Record<
      'page' | 'limit' | 'status' | 'OrderNumber' | 'RegistrationDate' | 'PaymentMethodId',
      string | undefined
    >
  >;
}

export default async function Page({ params, searchParams }: Props) {
  const { driverOrderId } = await params;
  let { page, limit, status, OrderNumber, RegistrationDate, PaymentMethodId } = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    ...(status && { Status: status }),
    OrderNumber: OrderNumber || '',
    RegistrationDate: RegistrationDate || '',
    PaymentMethodId: PaymentMethodId || '',
  });

  // Fetch driver order details
  const driverOrderDetails = await getData<{ items: DriverOrders; totalCount: number }>(
    `${endpoints.drivers.orderDriver(driverOrderId)}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.DriverOrder] }
  );

  if ('error' in driverOrderDetails) {
    throw new Error(driverOrderDetails.error);
  }

  // Fetch driver profile details
  const driverObj = await getData<any>(endpoints.drivers.single(driverOrderId));
  if ('error' in driverObj) {
    throw new Error(driverObj.error);
  }

  const paymentMethodItems = await getData<PaymentMethodsApiResponse>(
    `${endpoints.paynentMethod.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.PaymentMethod] }
  );

  if ('error' in paymentMethodItems) {
    throw new Error(paymentMethodItems.error);
  }

  return (
    <DriverOrderView
      driverOrderDetails={driverOrderDetails.data.items}
      paymentMethod={paymentMethodItems?.data?.data?.items}
      totalCount={driverOrderDetails.data.totalCount}
      driverName={driverObj.data.name}
    />
  );
}
