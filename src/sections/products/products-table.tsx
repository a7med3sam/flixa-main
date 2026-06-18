'use client';
import { Switch } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Product } from 'src/types/products';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { FetchTags } from 'src/actions/config-actions';
import ImageLink from 'src/components/image/image-link';
import BrokenImage from 'src/components/image/broken-image';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { editData, deleteData } from 'src/utils/crud-fetch-api';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { useMemo, useState, useEffect, useCallback } from 'react';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

const TABLE_HEAD = [
  { id: 'imageUrl', label: 'Global.Label.image' },
  { id: 'nameAr', label: 'Global.Label.name_ar' },
  { id: 'nameEn', label: 'Global.Label.name_en' },
  { id: 'barcode', label: 'Pages.Products.barcode' },
  { id: 'categoryName', label: 'Pages.Products.main_section' },
  { id: 'subCategoryName', label: 'Pages.Products.sub_section' },
  { id: 'isActive', label: 'Global.Label.status' },
];

interface Props {
  items: Product[];
  totalCount: number;
  onEdit: (product: Product) => void;
}

export default function ProductsTable({ items, totalCount, onEdit }: Props) {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const [productStatus, setProductStatus] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((product) => [product.id, product.isActive]))
  );
  const router = useRouter();
  const disableChangeStatus = useBoolean();
  const deleteDialog = useBoolean();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const isDeleting = useBoolean();

  // update products status on items change
  useEffect(() => {
    setProductStatus(Object.fromEntries(items.map((product) => [product.id, product.isActive])));
  }, [items]);

  const handleToggleStatus = useCallback(
    (id: string) => {
      if (disableChangeStatus.value) return;
      disableChangeStatus.onTrue();
      const originalStatus = productStatus[id];
      setProductStatus((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));

      (async () => {
        const formData = new FormData();
        formData.append('IsActive', String(!originalStatus));

        const res = await editData(endpoints.product.patch(id), 'PATCH', formData);

        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          setProductStatus((prev) => ({
            ...prev,
            [id]: originalStatus,
          }));
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_updated', {
              var: t('Nav.products'),
            })
          );
          invalidateTag(FetchTags.ProductsList);
        }
        disableChangeStatus.onFalse();
      })();
    },
    [productStatus, disableChangeStatus, enqueueSnackbar, t]
  );

  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.product.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t(`Pages.Products.product_title`),
            })
          );
          isDeleting.onFalse();
          deleteDialog.onFalse();
          invalidateTag(FetchTags.ProductsList);
        }
      })();
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t]
  );

  const customRender: Record<string, (item: Product) => React.ReactNode> = useMemo(
    () => ({
      imageUrl: (item) => {
        const imageUrl = item.productImages?.[0]?.url || '';
        return (
          <ImageLink href={imageUrl}>
            <BrokenImage src={imageUrl} />
          </ImageLink>
        );
      },
      isActive: (item) => (
        <Switch checked={!!productStatus[item.id]} onChange={() => handleToggleStatus(item.id)} />
      ),
      categoryName: (item) => item.category.nameAr || '',
      subCategoryName: (item) => item.category.parentCategory?.nameEn || '',
    }),
    [productStatus, handleToggleStatus]
  );

  return (
    <>
      <SharedTable
        tableHead={TABLE_HEAD}
        data={items}
        count={totalCount}
        customRender={customRender}
        actions={[
          {
            label: 'Global.Action.view',
            icon: ICONS.global.eye,
            onClick: (items) => {router.push(paths.controlPanel.products.details(items.id))},
          },
          {
            label: 'Global.Action.edit',
            icon: ICONS.global.edit,

            onClick: (product) => {
              onEdit(product); // Pass product to parent component
            },
          },
          {
            label: 'Global.Action.delete',
            icon: ICONS.global.delete,
            onClick: (product) => {
              setSelectedProductId(product.id);
              deleteDialog.onTrue();
            },
            sx: { color: 'error.main' },
          },
        ]}
      />
      <ConfirmDeleteDialog
        name={t('Pages.Products.product_title')}
        action={() => selectedProductId && handleDelete(selectedProductId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}
