import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { ReturnOrderDetails } from 'src/types/returned-order';
import ReturnedViewDetails from 'src/sections/returned-orders/views/view-return-order-details';

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function Page({ params }: Props) {
  const { orderId } =await params;
  const returnedOrderDetails = await getData<ReturnOrderDetails>(
    endpoints.returnOrders.single(orderId)
  );
if ('error' in returnedOrderDetails) {
    throw new Error(returnedOrderDetails.error);
  }
  return <ReturnedViewDetails orderDetails={returnedOrderDetails?.data} />;
}
