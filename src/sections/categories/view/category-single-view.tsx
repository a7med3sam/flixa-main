'use client';

import { paths } from 'src/routes/paths';
import { enqueueSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import { Category } from 'src/types/categories';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteData } from 'src/utils/crud-fetch-api';
import { useLocale, useTranslations } from 'next-intl';
import { FetchTags } from 'src/actions/config-actions';
import { Box, Card, Button, Container } from '@mui/material';
import { invalidateTag } from 'src/actions/cache-invalidation';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

import CategoryInfoCard from '../info-card';
import CategoriesTable from '../categories-table';
import CategoriesListFilters from '../list-filters';
import NewEditCategoryDialog from '../new-edit-dialog';

interface Props {
  category: Category;
  items: Category[];
  totalCount: number;
  parents?: Category[];
}

export default function CategorySingleView({ category, items, totalCount, parents }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const newEditDialog = useBoolean();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const isDeleting = useBoolean();
  const deleteDialog = useBoolean();

  const handleDelete = useCallback(() => {
    isDeleting.onTrue();
    (async () => {
      const res = await deleteData(endpoints.categories.delete(category.id));
      if ('error' in res) {
        enqueueSnackbar(res.error, { variant: 'error' });
      } else {
        enqueueSnackbar(
          t('Global.Server.Success.var_deleted', {
            var: t('Global.Label.category'),
          })
        );
        isDeleting.onFalse();
        deleteDialog.onFalse();
        invalidateTag(FetchTags.CategoriesList);
      }
    })();
  }, [category.id, deleteDialog, isDeleting, t]);

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Pages.Categories.categories_title')}
        links={[
          {
            name: t('Pages.Categories.categories_title'),
            href: paths.controlPanel.categories.list,
          },
          {
            name: category[locale === 'ar' ? 'nameAr' : 'nameEn'],
          },
        ]}
        activeLast
        actions={[
          {
            children: t('Global.Action.delete'),
            variant: 'outlined',
            onClick: () => {
              deleteDialog.onTrue();
            },
            sx: { minWidth: 120, maxWidth: '100%' },
          },
          {
            children: t('Global.Action.edit'),
            onClick: () => {
              newEditDialog.onTrue();
              setSelectedCategory(category);
            },
            sx: { minWidth: 120, maxWidth: '100%' },
          },
        ]}
      />

      <CategoryInfoCard category={category} />

      <Box mt={3} />

      <Card>
        <CategoriesListFilters
          action={
            <Button
              color="primary"
              variant="soft"
              // size="large"
              sx={{ mb: 1, marginInlineStart: 'auto', display: 'block', height: '100%' }}
              onClick={() => {
                newEditDialog.onTrue();
              }}
              fullWidth
            >
              {t('Pages.Categories.add_subcategory')}
            </Button>
          }
        />

        <CategoriesTable
          items={items}
          totalCount={totalCount}
          onEdit={(item) => {
            setSelectedCategory(item);
            newEditDialog.onTrue();
          }}
          type="SUB_CATEGORY"
        />
      </Card>

      <NewEditCategoryDialog
        open={newEditDialog.value}
        onClose={() => {
          newEditDialog.onFalse();
          setSelectedCategory(undefined);
        }}
        category={selectedCategory}
        parents={selectedCategory?.parentCategoryId ? parents : undefined}
        staticParent={!selectedCategory ? category : undefined}
      />
      <ConfirmDeleteDialog
        name={t('Global.Label.category')}
        action={() => handleDelete()}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </Container>
  );
}
