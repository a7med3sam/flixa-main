'use client';
import React from 'react'
import { useTranslations } from 'next-intl';
import { Card, Container } from '@mui/material';
import { Drivers, DriverStatus } from 'src/types/driver';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DriverTableView from '../list-table';
import ListFiltersDrivers from '../list-filters';

interface Props{
    driversList:Drivers[];
    totalCount:number
    total:DriverStatus | {};
}

export default function DriverListView({driversList,totalCount,total}:Props) {
    const t = useTranslations();
  return (
    <Container>
         <CustomBreadcrumbs
              heading={t('Pages.Drivers.driver_title')} links={[]}              
              />
        <Card sx={{m:2}}>
            <ListFiltersDrivers totalStatus={total} />
            <DriverTableView items={driversList} totalCount={totalCount}/>
        </Card>

</Container>
  )
}
