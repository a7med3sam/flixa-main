'use client';

import { useState } from 'react';
// types
import { Unit } from 'src/types/units';
import { useTranslations } from 'next-intl';
import { Stack, Container } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// components
import UnitsTable from '../units-table';
import NewEditDialog from '../new-edit-dialog';

interface Props {
  items: Unit[];
  totalCount: number;
}

export default function UnitsListView({ items, totalCount }: Props) {
  const t = useTranslations();

  const newEditDialog = useBoolean();
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const handleOpenEditDialog = (unit: Unit) => {
    setSelectedUnit(unit);
    newEditDialog.onTrue();
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Pages.Units.units_title')}
        links={[{}]}
        actions={[
          {
            children: t('Pages.Units.add_unit'),
            onClick: () => {
              setSelectedUnit(null);
              newEditDialog.onTrue();
            },
          },
        ]}
      />

      <Stack spacing={3}>
        <UnitsTable items={items ?? []} totalCount={totalCount} onEdit={handleOpenEditDialog} />

        <NewEditDialog
          open={newEditDialog.value}
          onClose={newEditDialog.onFalse}
          unit={selectedUnit}
        />
      </Stack>
    </Container>
  );
}
