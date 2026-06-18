'use client';
import { useSnackbar } from 'notistack';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import Switch from '@mui/material/Switch';
import { Banner } from 'src/types/banner';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { fDate } from 'src/utils/format-time';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { FetchTags } from 'src/actions/config-actions';
import ImageLink from 'src/components/image/image-link';
import BrokenImage from 'src/components/image/broken-image';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { editData, deleteData } from 'src/utils/crud-fetch-api';
import SharedTable from 'src/components/SharedTable/SharedTable';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

interface Props {
  items: Banner[];
  totalCount: number;
}

export default function BannersTable({ items, totalCount }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const disableChangeStatus = useBoolean();
  const isDeleting = useBoolean();
  const router = useRouter();
  const deleteDialog = useBoolean();
  const t = useTranslations();
  const [selectedBannerId, setselectedBannerId] = useState<string | null>(null);

  const tableHead = [
    { id: 'Image', label: 'Global.Label.image' },
    { id: 'startDate', label: 'Pages.Banners.start_date' },
    { id: 'endDate', label: 'Pages.Banners.end_date' },
    { id: 'IsActive', label: 'Global.Label.status' },
  ];
  // State to track banner status
  const [bannerStatus, setBannerStatus] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((item) => [item.id, item.isActive]))
  );

  // sync banner status when items change (pagination)
  useEffect(() => {
    setBannerStatus(Object.fromEntries(items.map((item) => [item.id, item.isActive])));
  }, [items]);

  const handleToggleStatus = useCallback(
    (id: string) => {
      (async () => {
        if (disableChangeStatus.value) return;

        disableChangeStatus.onTrue();

        const originalStatus = bannerStatus[id];
        const newStatus = !originalStatus;

        // Optimistically update the UI
        setBannerStatus((prev) => ({
          ...prev,
          [id]: newStatus,
        }));

        const bannerToUpdate = items.find((item) => item.id === id);
        if (!bannerToUpdate) {
          disableChangeStatus.onFalse();
          return;
        }

        const formData = new FormData();
        formData.append('Url', bannerToUpdate.url);
        formData.append('StartDate', bannerToUpdate.startDate);
        formData.append('EndDate', bannerToUpdate.endDate);
        formData.append('IsActive', String(newStatus));

        const res = await editData(endpoints.banners.patch(id), 'PATCH', formData);

        if ('error' in res) {
          enqueueSnackbar(res.error || 'Failed to update status', { variant: 'error' });

          // Roll back the optimistic update
          setBannerStatus((prev) => ({
            ...prev,
            [id]: originalStatus,
          }));

          disableChangeStatus.onFalse();
          return;
        }

        enqueueSnackbar(t('Global.Server.Success.var_updated', { var: t('Nav.Marketing.banners') }), {
          variant: 'success',
        });

        router.push(paths.controlPanel.marketings.banners.list);
        disableChangeStatus.onFalse();
      })();
    },
    [bannerStatus, disableChangeStatus, enqueueSnackbar, items, router, t]
  );

  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.banners.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t(`Pages.Banners.this_banner`),
            })
          );
          isDeleting.onFalse();
          deleteDialog.onFalse();
          invalidateTag(FetchTags.CategoriesList);
        }
      })();
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t]
  );

  // Table render logic
  const customRender: Record<string, (item: Banner) => React.ReactNode> = useMemo(
    () => ({
      Image: (item) => (
        <ImageLink href={item?.url}>
          <BrokenImage src={item?.url} />
        </ImageLink>
      ),
      startDate: (item) => fDate(item?.startDate, 'dd-MM-yyyy'),
      endDate: (item) => fDate(item?.endDate, 'dd-MM-yyyy'),
      IsActive: (item) => (
        <Switch
          checked={!!bannerStatus[item.id]}
          onChange={() => handleToggleStatus(item.id)}
          disabled={disableChangeStatus.value}
        />
      ),
    }),
    [bannerStatus, disableChangeStatus.value, handleToggleStatus]
  );

  return (
    <>
      <SharedTable
        tableHead={tableHead}
        data={items}
        customRender={customRender}
        count={totalCount}
        actions={[
          {
            label: 'Global.Action.edit',
            icon: ICONS.global.edit,
            onClick: (item) => {
              router.push(paths.controlPanel.marketings.banners.edit(item.id));
            },
          },
          {
            label: 'Global.Action.delete',
            icon: ICONS.global.delete,
            onClick: (item) => {
              setselectedBannerId(item.id);
              deleteDialog.onTrue();
            },
            sx: { color: 'error.main' },
          },
        ]}
      />
      <ConfirmDeleteDialog
        name={t('Pages.Banners.this_banner')}
        action={() => selectedBannerId && handleDelete(selectedBannerId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}
