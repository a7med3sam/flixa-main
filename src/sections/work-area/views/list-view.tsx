'use client';
import React from 'react';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { WorkArea } from 'src/types/work-area';
import { Card, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import WorkAreaTable from '../list-table';
import WorkAreaFilters from '../list-filter';


interface Props {
    WorkAreas: WorkArea[];
    totalCount: number;
}
export default function WorkAreaView({ WorkAreas, totalCount }: Props) {
    const t = useTranslations();
    const router = useRouter();
  
    return (
    
    <Container>
      <CustomBreadcrumbs
        heading={t('Nav.Work-area')}
        links={[{}]}
        actions={[
          {
            children: t('Global.Action.add') + ' ' + t('Pages.WorkArea.work_area'),
            onClick: () => router.push(paths.controlPanel.workArea.new),
          },
          
        ]}
      />
      <Card>
        <WorkAreaFilters workAreas={WorkAreas}/>
        <WorkAreaTable items={WorkAreas} totalCount={totalCount} />
      </Card>
    </Container>
  )
}
