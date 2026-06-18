'use client'
import React from 'react'
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { Card, Container } from '@mui/material';
import { ClientItemDetails } from 'src/types/clients';
import { Order, PaymentMethod } from 'src/types/order';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ClientInfoCard from './client-info-card';
import ClientOrderTable from '../client-order-table';
import ListFilterOrderClient from '../list-filter-order-client';
interface Props {
  clientDetails: ClientItemDetails;
  clientOrder:Order[];
  totalCount:number;
  paymentMethod:PaymentMethod[];
}

export default function ClientDetails({clientDetails,clientOrder,totalCount,paymentMethod}:Props) {

const  t = useTranslations();
  return (
    <Container>
    <CustomBreadcrumbs
      heading={t('Pages.Clients.client_name')}
      links={[
        {
          name: t('Nav.Users.clients'),
          href: paths.controlPanel.users.clients.list,
        },
        {
          name:clientDetails.name ,
          href: paths.controlPanel.users.clients.list,
        },
        
      ]}
      activeLast
    
    />

    <ClientInfoCard client={clientDetails} />
    <Card sx={{my:2}}>
    <ListFilterOrderClient   paymentMethodItems={paymentMethod}/>
    <ClientOrderTable clientOrderList={clientOrder} total={totalCount}/>
    </Card>
    </Container>  )
}
