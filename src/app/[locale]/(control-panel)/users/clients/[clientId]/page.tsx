
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import {  ClientItemDetails } from 'src/types/clients';
import { FetchTags } from 'src/actions/config-actions';
import { Order, PaymentMethodsApiResponse } from 'src/types/order';
import ClientDetails from 'src/sections/clients/client-details/views/list-view';

interface Props {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<
  Record<'page' | 'limit' |'search'|'PaymentMethodId'| 'status' | 'RegistrationDate', string | undefined>
>;
}

export default async function Page({ params ,searchParams}: Props) {
  let { page, limit,search, PaymentMethodId,status,RegistrationDate,} = await searchParams;
  const  {clientId}  =await params;
  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || '5',
    RegistrationDate: RegistrationDate || '',
    PaymentMethodId:PaymentMethodId || '',
    ...(search && { OrderNumber: search }),
    ...(status && { Status: status }),

  });

  const clientDetails = await getData<ClientItemDetails>(endpoints.clients.single(clientId));
    if ('error' in clientDetails) {
      throw new Error(clientDetails.error);
    }

   
  const clientOrderList = await getData<{ totalCount: number; items: Order[] }>(
    `${endpoints.clients.orderClient(clientId)}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.ClientsList] }
  );
  if ('error' in clientOrderList) {
    throw new Error(clientOrderList.error);
  }
  
    const paymentMethodItems = await getData<PaymentMethodsApiResponse>(
      `${endpoints.paynentMethod.list}?${urlSearchParams.toString()}`,
      { tags: [FetchTags.PaymentMethod] }
    );
    
    if ('error' in paymentMethodItems) {
      throw new Error(paymentMethodItems.error);
    }
  return <ClientDetails
   clientDetails={clientDetails?.data} 
   clientOrder={clientOrderList?.data?.items}
   totalCount={clientOrderList?.data?.totalCount}
   paymentMethod={paymentMethodItems?.data?.data?.items}

    />;
}