'use client';
import { paths } from 'src/routes/paths';
import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { WorkArea } from 'src/types/work-area';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import WorkAreaForm from '../new-edit-form';


interface Props {
  workDetails?: WorkArea;
}

export default function NewEditWorkingArea({ workDetails }: Props) {
  const t = useTranslations();

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t(workDetails ? 'Pages.WorkArea.edit_work_area' : 'Pages.WorkArea.add_work_area')}
        links={[
          { name: t('Nav.Work-area'), href: paths.controlPanel.workArea.list },
          { name: workDetails ? workDetails.name : t('Pages.WorkArea.add_work_area') },
        ]}
        activeLast
      />

      <WorkAreaForm workDetails={workDetails} />
    </Container>
  );
}