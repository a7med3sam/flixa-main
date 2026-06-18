'use client';
import React from 'react'
import { useTranslations } from 'next-intl';
import { OrderStatus } from 'src/types/order';
import { Card, Container } from '@mui/material'
import { ReturnedOrder } from 'src/types/returned-order'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ReturnedListFilter from '../list-filters';
import ReturnedOrderTable from '../returned-order-table'

interface props {
  returnOrderList:ReturnedOrder[],
  totalCount:number,
  count:OrderStatus|{}
}
export default function ReturnedOrderView({returnOrderList,totalCount,count}:props) {
  const t=useTranslations();
  return (
    <Container>
    <CustomBreadcrumbs heading={t('Nav.return-orders')} links={[{}]} />
     <Card>
        <ReturnedListFilter items={returnOrderList} totalStatus={count}/>
        <ReturnedOrderTable items={returnOrderList} totalCount={totalCount}/>
      </Card>
    </Container>
  )

}
