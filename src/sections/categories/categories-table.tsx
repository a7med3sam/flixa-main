'use client';
import { useState } from 'react';
import { useCallback } from 'react';
import { Switch } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import { useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Category } from 'src/types/categories';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { FetchTags } from 'src/actions/config-actions';
import ImageLink from 'src/components/image/image-link';
import BrokenImage from 'src/components/image/broken-image';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { editData, deleteData } from 'src/utils/crud-fetch-api';
import SharedTable from 'src/components/SharedTable/SharedTable';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

const TABLE_HEAD = [
  { id: 'imageUrl', label: 'Global.Label.image' },
  { id: 'nameAr', label: 'Global.Label.name_ar' },
  { id: 'nameEn', label: 'Global.Label.name_en' },
  { id: 'order', label: 'Global.Label.order' },
  { id: 'isActive', label: 'Global.Label.status' },
];

const TABLE_HEAD_SUB_CATEGORY = [
  { id: 'parentNameAr', label: 'Pages.Categories.category_name_ar' },
  { id: 'parentNameEn', label: 'Pages.Categories.category_name_en' },
];

interface Props {
  items: Category[];
  totalCount: number;
  onEdit: (category: Category) => void;
  type: 'CATEGORY' | 'SUB_CATEGORY';
  viewParentName?: boolean;
}

export default function CategoriesTable({
  items,
  totalCount,
  onEdit,
  type,
  viewParentName,
}: Props) {

  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [categoriesStatus, setCategoriesStatus] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((category) => [category.id, category.isActive]))
  );
  const disableChangeStatus = useBoolean();
  const deleteDialog = useBoolean();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const isDeleting = useBoolean();

  // update categories status on items change
  useEffect(() => {
    setCategoriesStatus(
      Object.fromEntries(items.map((category) => [category.id, category.isActive]))
    );
  }, [items]);

  const handleToggleStatus = useCallback(
    (id: string) => {
      if (disableChangeStatus.value) return;
      disableChangeStatus.onTrue();

      const originalStatus = categoriesStatus[id];
      setCategoriesStatus((prev) => {
        return {
          ...prev,
          [id]: !prev[id],
        };
      });
      (async () => {
        const formData = new FormData();
        formData.append('IsActive', String(!originalStatus));

        const res = await editData(endpoints.categories.patch(id), 'PATCH', formData);

        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          setCategoriesStatus((prev) => ({
            ...prev,
            [id]: originalStatus,
          }));
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_updated', {
              var: t(`Global.Label.${type === 'CATEGORY' ? 'category' : 'subcategory'}`),
            })
          );
          invalidateTag(FetchTags.CategoriesList);
        }
        disableChangeStatus.onFalse();
      })();
    },
    [categoriesStatus, disableChangeStatus, enqueueSnackbar, t, type]
  );

  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.categories.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          isDeleting.onFalse();
          deleteDialog.onFalse();
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t(`Global.Label.${type === 'CATEGORY' ? 'category' : 'subcategory'}`),
            })
          );
          isDeleting.onFalse();
          deleteDialog.onFalse();
          invalidateTag(FetchTags.CategoriesList);
        }
      })();
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t, type]
  );

  const customRender: Record<string, (item: Category) => React.ReactNode> = useMemo(
    () => ({
      imageUrl: (item) => (
        <ImageLink href={item.imageUrl}>
          <BrokenImage src={item.imageUrl} />
        </ImageLink>
      ),
      isActive: (item) => (
        <Switch checked={!!categoriesStatus[item.id]} onChange={() => handleToggleStatus(item.id)} />
      ),
      parentNameAr: (item) => item.parentCategory?.nameAr,
      parentNameEn: (item) => item.parentCategory?.nameEn,
    }),
    [categoriesStatus, handleToggleStatus]
  );
  return (
    <>
      <SharedTable
        tableHead={[...TABLE_HEAD, ...(viewParentName ? TABLE_HEAD_SUB_CATEGORY : [])]}
        data={items}
        count={totalCount}
        customRender={customRender}
        actions={[
          {
            label: 'Global.Action.view',
            icon: ICONS.global.eye,
            onClick: (category) => {
              router.push(
                paths.controlPanel[type === 'CATEGORY' ? 'categories' : 'subCategories'].single(
                  category.id
                )
              );
            },
          },
          {
            label: 'Global.Action.edit',
            icon: ICONS.global.edit,
            onClick: (category) => {
              onEdit(category);
            },
          },
          {
            label: 'Global.Action.delete',
            icon: ICONS.global.delete,
            onClick: (category) => {
              setSelectedCategoryId(category.id);
              deleteDialog.onTrue();
            },
            sx: { color: 'error.main' },
          },
        ]}
      />
      <ConfirmDeleteDialog
        name={t(`Global.Label.${type === 'CATEGORY' ? 'category' : 'subcategory'}`)}
        action={() => selectedCategoryId && handleDelete(selectedCategoryId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}
