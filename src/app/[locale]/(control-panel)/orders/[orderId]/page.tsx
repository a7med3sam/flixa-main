import { Drivers } from 'src/types/driver';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { OrderResponse, OrderDetailsType } from 'src/types/order';
import OrderDetails from 'src/sections/orders/view/order-details';

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function Page({ params }: Props) {
  const  {orderId}  =await params;

  const orderDetails = await getData<OrderDetailsType>(endpoints.order.single(orderId));
  if ('error' in orderDetails) {
    throw new Error(orderDetails.error);
  }
  const editStatus = await getData<OrderResponse>(endpoints.order.single(orderId));
  if ('error' in editStatus) {
    throw new Error(editStatus.error);
  }

  const driverList = await getData<{ totalCount: number; items: Drivers[] }>(
    endpoints.drivers.list
  );

  if ('error' in driverList) {
    throw new Error(driverList.error);
  }  
       return <OrderDetails orderDetails={orderDetails?.data}  drivers={driverList.data.items}/>;
  }