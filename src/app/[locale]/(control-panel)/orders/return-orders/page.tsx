import { OrderStatus } from 'src/types/order';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { ApiResponse } from 'src/types/crud-types';
import { NoPermissionView } from 'src/sections/error';
import { ReturnedOrder } from 'src/types/returned-order';
import ReturnedOrderView from 'src/sections/returned-orders/views/list-view';

interface Props {
  searchParams: Promise<
    Record<'page' | 'limit' | 'OrderDate' | 'search' | 'Status', string | undefined>
  >;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, OrderDate, search, Status } = await searchParams;
  page = page || '1';
  limit = limit || '5';

  const urlSearchParams = new URLSearchParams({
    SkipCount: `${(Number(page) - 1) * Number(limit)}`,
    MaxResultCount: limit,
    OrderDate: OrderDate || '',
    ...(search && { SearchTerm: search }),
    ...(Status && { OrderStatus: Status }),
  });

  const ReturnedOrderList = await getData<{ totalCount: number; items: ReturnedOrder[] }>(
    `${endpoints.returnOrders.list}?${urlSearchParams.toString()}`
  );

  if ('error' in ReturnedOrderList) {
    if(ReturnedOrderList.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(ReturnedOrderList.error);
  }

  const totalStatus = await getData<ApiResponse<OrderStatus>>(endpoints.returnOrders.count);

  if ('error' in totalStatus) {
    throw new Error(totalStatus.error);
  }
  return (
    <ReturnedOrderView
      returnOrderList={ReturnedOrderList?.data?.items}
      totalCount={ReturnedOrderList.data.totalCount}
      count={totalStatus?.data}
    />
  );
}
