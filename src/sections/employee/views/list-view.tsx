'use client';
import React from 'react';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/navigation';
import { Employee } from 'src/types/employee';
import { Card, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EmployeeTableView from '../list-table';
import ListFiltersEmployee from '../list-filters';

interface Props {
  items: Employee[];
  totalCount: number;
}

export default function EmployeeListView({ items, totalCount }: Props) {
  const t = useTranslations();
  const router = useRouter();
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Nav.Users.employees')}
        links={[]}
        actions={[
          {
            children: t('Global.Action.add') + ' ' + t('Pages.Employee.title'),
            onClick: () => {
              router.push(paths.controlPanel.users.employee.register);
            },
          },
        ]}
      />
      <Card sx={{ m: 2 }}>
        <ListFiltersEmployee totalCount={totalCount} items={items} />
        <EmployeeTableView items={items} totalCount={totalCount} />
      </Card>
    </Container>
  );
}
