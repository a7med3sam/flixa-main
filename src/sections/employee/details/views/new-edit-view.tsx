
'use client';

import React from 'react';
import { paths } from 'src/routes/paths';
import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Employee, EmployeePermission } from 'src/types/employee';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NewEditForm from '../employee-details-edit';


interface Props {
  employeeDetails?: Employee ; // Made optional
  permissionList?:EmployeePermission[];
}

export default function EmployeeDetailsView({ employeeDetails,permissionList }: Props) {
  const t = useTranslations();

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={employeeDetails? t('Pages.Employee.edit_employee'): t('Pages.Employee.add_employee')}
        links={[
          { name: t('Nav.Users.employees'), href: paths.controlPanel.users.employee.list },
              {name: employeeDetails? t('Pages.Employee.edit_employee'): t('Pages.Employee.add_employee'),},
            ]}
      />

      <NewEditForm employeeDetails={employeeDetails} permissionList={permissionList} />
    </Container>
  );
}
