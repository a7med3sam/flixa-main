'use client';
import { useSnackbar } from 'notistack';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import Switch from '@mui/material/Switch';
import { useRouter } from 'next/navigation';
import { fDate } from 'src/utils/format-time';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocale, useTranslations } from 'next-intl';
import { FetchTags } from 'src/actions/config-actions';
import { Box, Stack, Typography } from '@mui/material';
import ImageLink from 'src/components/image/image-link';
import { Clients, TotalStatus } from 'src/types/clients';
import BrokenImage from 'src/components/image/broken-image';
import React, { useMemo, useState, useCallback } from 'react';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { editData, deleteData } from 'src/utils/crud-fetch-api';
import SharedTable from 'src/components/SharedTable/SharedTable';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

interface Props {
  items: Clients[];
  totalCount: TotalStatus;
}

export default function ClientsTable({ items, totalCount }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const deleteDialog = useBoolean();
  const isDeleting = useBoolean();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const tableHead = [
    { id: 'name', label: 'Pages.Clients.client_name' },
    { id: 'phoneNumber', label: 'Pages.Clients.client_phone' },
    { id: 'registrationDate', label: 'Pages.Clients.account_date' },
    { id: 'status', label: 'Pages.Clients.account_status' },
  ];

  const moveFirstToLastIfArabic = (text: string) => {
  if (locale === 'ar' && text?.startsWith('+') && text.length > 1) {
    return text.slice(1) + '+';
  }
  return text;
};

  const handleStatusChange = useCallback(
    async (id: string, newStatus: 'Active' | 'Blocked') => {
      const res = await editData(
        endpoints.clients.editStatus(id),
        'PATCH',
        { status: newStatus }
      );

      if ('error' in res) {
        enqueueSnackbar(res.error, { variant: 'error' });
        return false;
      } else {
        enqueueSnackbar(
          t('Global.Server.Success.var_updated', {
            var: t('Pages.Clients.account_status'),
          })
        );
        invalidateTag(FetchTags.ClientsList);
        return true;
      }
    },
    [enqueueSnackbar, t]
  );

  const handleToggleStatus = useCallback(
    (item: Clients) => {
      const newStatus = item.status === 'Active' ? 'Blocked' : 'Active';
      handleStatusChange(item.id, newStatus);
    },
    [handleStatusChange]
  );

  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.clients.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: 'Pages.Clients.client_name',
            })
          );
          deleteDialog.onFalse();
          invalidateTag(FetchTags.CategoriesList);
        }
        isDeleting.onFalse();
      })();
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t]
  );

  const customRender: Record<string, (item: Clients) => React.ReactNode> = useMemo(
    () => ({
      name: (item) => (
        <Stack
          key={`name-${item.id}`}
          direction="row"
          alignItems="center"
          spacing={3}
        >
          <ImageLink href={item.profileImage || ''}>
            <BrokenImage src={item.profileImage || ''} />
          </ImageLink>
          <Box>
            <Typography fontWeight="500">
              {item.name}
            </Typography>
          </Box>
        </Stack>
      ),
      phoneNumber: (item) => {
        let fixedPhoneNumber = item.phoneNumber;

        //  If Arabic, move first char to the end
        if (locale === 'ar') {
          fixedPhoneNumber = moveFirstToLastIfArabic(fixedPhoneNumber);
        }

        return (
          <Box
            sx={{
              direction: 'ltr',
              textAlign: 'left',
              fontFamily: 'monospace',
            }}
          >
            {fixedPhoneNumber}
          </Box>
        );
      }, registrationDate: (item) =>
        item.creationTime && fDate(item.creationTime, 'dd-MM-yyyy'),
      status: (item) => (
        <Switch
          checked={item.status === 'Active'}
          onChange={() => handleToggleStatus(item)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      ),
    }),
    [handleToggleStatus]
  );

  return (
    <>
      <SharedTable
        tableHead={tableHead}
        data={items}
        customRender={customRender}
        count={totalCount.totalCount}
        actions={[
          {
            label: 'Global.Action.view',
            icon: ICONS.global.eye,
            onClick: (item) => {
              router.push(paths.controlPanel.users.clients.single(item.id));
            },
          },
          {
            hide: (item) => item.status === 'Blocked',
            label: 'Global.Action.block',
            icon: ICONS.global.block,
            onClick: handleToggleStatus,
          },
          {
            hide: (item) => item.status === 'Active',
            label: 'Global.Action.active',
            icon: ICONS.global.active,
            onClick: handleToggleStatus,
          },
          {
            label: 'Global.Action.delete',
            icon: ICONS.global.delete,
            onClick: (item) => {
              setSelectedClientId(item.id);
              deleteDialog.onTrue();
            },
            sx: { color: 'error.main' },
          },
        ]}
      />

      <ConfirmDeleteDialog
        name={t('Pages.Clients.this_client', {
          var: items.find((item) => item.id === selectedClientId)?.name,
        })}
        action={() => selectedClientId && handleDelete(selectedClientId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}