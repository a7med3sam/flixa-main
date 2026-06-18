'use client';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { WorkArea } from 'src/types/work-area';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteData } from 'src/utils/crud-fetch-api';
import { FetchTags } from 'src/actions/config-actions';
import ImageLink from 'src/components/image/image-link';
import React, { useMemo, useState, useCallback } from 'react';
import { invalidateTag } from 'src/actions/cache-invalidation';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { Stack, Avatar, Switch, Typography } from '@mui/material';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

interface Props {
  items: WorkArea[];
  totalCount: number;
}
export default function WorkAreaTable({ items, totalCount }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const isDeleting = useBoolean();
  const router = useRouter();
  const deleteDialog = useBoolean();
  const t = useTranslations();
  const [selectedBannerId, setselectedBannerId] = useState<string | null>(null);

  const tableHead = [
    { id: 'image', label: 'Pages.WorkArea.area' },
    { id: 'nameEn', label: 'Global.Label.name_en' },
    { id: 'radiusInMeters', label: 'Pages.WorkArea.avaliable_space' },
    { id: 'shopingPrice', label: 'Pages.WorkArea.shopping_price' },
    { id: 'isActive', label: 'Global.Label.status' },
  ];

  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.workArea.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t(`Pages.WorkArea.this_area`),
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

  const customRender: Record<string, (item: WorkArea) => React.ReactNode> = useMemo(
    () => ({
      image: (item) => (
        <Stack direction="row" alignItems="center">
          <ImageLink
            href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
            // target="_blank"
            key={item.id}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'success.main',
                borderRadius: 1,
              }}
            >
              <Icon icon="mdi:map-marker" style={{ color: '#fff', fontSize: 24 }} />
            </Avatar>
          </ImageLink>
          <Typography variant="body2" sx={{ ml: 3 }}>
            {item.nameAr}
          </Typography>
        </Stack>
      ),
      nameEn:(item)=>item.nameEn,
      radiusInMeters: (item) => item.radiusInMeters,
      shopingPrice: (item) => item.shopingPrice,
      isActive: (item) => <Switch checked={item.isActive} />,
    }),
    []
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
              router.push(paths.controlPanel.workArea.edit(item.id));
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
        name={t('Pages.WorkArea.this_area')}
        action={() => selectedBannerId && handleDelete(selectedBannerId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}
