'use client';
import React from 'react'
import { useTranslations } from 'next-intl';
import { Card, Container } from '@mui/material'
import { Clients, TotalStatus } from 'src/types/clients';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ClientsTable from '../list-table';
import ClientsListFilter from '../list-filters';

interface Props {
 clients: Clients[];
 totalStatus: TotalStatus;
}

export default function ClientsListView({ clients,totalStatus }:Props){
const t=useTranslations();
    return (
    <Container>
    <CustomBreadcrumbs heading={t('Nav.Users.clients')} links={[{}]} />
     <Card>
        <ClientsListFilter items={clients} totalStatus={totalStatus}/>
        <ClientsTable items={clients} totalCount={totalStatus}/>
      </Card>
    </Container>  )
}
