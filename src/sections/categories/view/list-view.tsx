'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Category } from 'src/types/categories';
import { Card, Container } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CategoriesTable from '../categories-table';
import CategoriesListFilters from '../list-filters';
import NewEditCategoryDialog from '../new-edit-dialog';

interface Props {
  items: Category[];
  totalCount: number;
  type: 'CATEGORY' | 'SUB_CATEGORY';
  parents?: Category[];
  viewParentName?: boolean;
}

export default function CategoriesListView({
  items,
  totalCount,
  type,
  parents,
  viewParentName,
}: Props) {
  const t = useTranslations();
  const newEditDialog = useBoolean();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  return (
    <Container>
      <CustomBreadcrumbs
        heading={
          type === 'CATEGORY'
            ? t('Pages.Categories.categories_title')
            : t('Pages.Categories.subcategories_title')
        }
        links={[{}]}
        actions={[
          {
            children:
              type === 'CATEGORY'
                ? t('Pages.Categories.add_category')
                : t('Pages.Categories.add_subcategory'),
            onClick: () => newEditDialog.onTrue(),
          },
        ]}
      />

      <Card>
        <CategoriesListFilters parents={parents} />

        <CategoriesTable
          items={items}
          totalCount={totalCount}
          onEdit={(category) => {
            setSelectedCategory(category);
            newEditDialog.onTrue();
          }}
          type={type}
          viewParentName={viewParentName}
        />

        <NewEditCategoryDialog
          open={newEditDialog.value}
          onClose={() => {
            newEditDialog.onFalse();
            setSelectedCategory(null);
          }}
          category={selectedCategory || undefined}
          parents={parents}
        />
      </Card>
    </Container>
  );
}
