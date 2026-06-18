'use client';

import { useCallback } from 'react';
import { paths } from 'src/routes/paths';
import { enqueueSnackbar } from 'notistack';
import { Product } from 'src/types/products';
import { Card, Container } from '@mui/material';
import { Category } from 'src/types/categories';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteData } from 'src/utils/crud-fetch-api';
import { useLocale, useTranslations } from 'next-intl';
import { FetchTags } from 'src/actions/config-actions';
import { invalidateTag } from 'src/actions/cache-invalidation';
import ProductsTable from 'src/sections/products/products-table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

import CategoryInfoCard from '../info-card';
import NewEditCategoryDialog from '../new-edit-dialog';
import ProductsListFiltersInSubCategory from '../list-filters-product-in-subCategoryDetails';

interface Props {
  subCategory: Category;
  mainCategories?: Category[];
  products: Product[];
  totalCount: number;
}


export default function SubcategorySingleView({ subCategory, mainCategories, products,totalCount }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const newEditDialog = useBoolean();
  const isDeleting = useBoolean();
  const deleteDialog = useBoolean();

  const handleDelete = useCallback(() => {
    isDeleting.onTrue();
    (async () => {
      const res = await deleteData(endpoints.categories.delete(subCategory.id));
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
  }, [deleteDialog, isDeleting, subCategory.id, t]);

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Pages.Categories.subcategories_title')}
        links={[
          {
            name: t('Pages.Categories.subcategories_title'),
            href: paths.controlPanel.subCategories.list,
          },
          {
            name: subCategory[locale === 'ar' ? 'nameAr' : 'nameEn'],
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
            },
            sx: { minWidth: 120, maxWidth: '100%' },
          },
        ]}
      />
      <CategoryInfoCard category={subCategory} />
      <Card sx={{ my: 3 }}>
        <ProductsListFiltersInSubCategory />
      <ProductsTable items={products} totalCount={totalCount} onEdit={()=>{}} />
      </Card>
      <NewEditCategoryDialog
        open={newEditDialog.value}
        onClose={() => {
          newEditDialog.onFalse();
        }}
        category={subCategory}
        parents={mainCategories}
      />
      <ConfirmDeleteDialog
        name={t('Global.Label.subcategory')}
        action={() => handleDelete()}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </Container>
  );
}
