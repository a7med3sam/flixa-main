'use client';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { fDate } from 'src/utils/format-time';
import { Employee } from 'src/types/employee';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import React, { useState, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { FetchTags } from 'src/actions/config-actions';
import ImageLink from 'src/components/image/image-link';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { editData, deleteData } from 'src/utils/crud-fetch-api';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { Box, Stack, Avatar, Switch, Typography } from '@mui/material';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

interface Props {
  items: Employee[];
  totalCount: number;
}

export default function EmployeeTableView({ items, totalCount }: Props) {
  const deleteDialog = useBoolean();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale()

  const isDeleting = useBoolean();
  const [selectedEmployeeId, setselectedEmployeeId] = useState<string | null>(null);

  const tableHead = [
    { id: 'employee', label: 'Pages.Employee.title' },
    { id: 'phoneNumber', label: 'Global.Label.phone' },
    { id: 'registrationDate', label: 'Pages.Drivers.table.registrationDate' },
    { id: 'status', label: 'Pages.Drivers.table.status' },
  ];

  const moveFirstToLastIfArabic = (text: string) => {
  if (locale === 'ar' && text?.startsWith('+') && text.length > 1) {
    return text.slice(1) + '+';
  }
  return text;
};

  const handleStatusChange = useCallback(
    async (id: string, newStatus: 'Active' | 'Blocked') => {
      const res = await editData(endpoints.employee.editStatus(id), 'PUT', { status: newStatus });

      if ('error' in res) {
        enqueueSnackbar(res.error, { variant: 'error' });
      } else {
        enqueueSnackbar(
          t('Global.Server.Success.var_updated', {
            var: t('Pages.Drivers.table.status'),
          })
        );
        invalidateTag(FetchTags.EmployeesList);
      }
    },
    [t]
  );

  const handleToggleStatus = useCallback(
    (item: Employee) => {
      const newStatus = item.status === 'Active' ? 'Blocked' : 'Active';
      handleStatusChange(item.id, newStatus);
    },
    [handleStatusChange]
  );

  const customRender: Record<string, (item: Employee) => React.ReactNode> = {
    employee: (item) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <ImageLink href={item.url || ''}>
          <Avatar
            src={item.url || ''}
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2, // or '8px'
              backgroundColor: '#F4F4F4', // light gray background
              border: '1px dashed #E0E0E0', // optional for a placeholder feel
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          />
        </ImageLink>
        <Stack direction="column" spacing={1} justifyContent={'flex-start'}>
          <Typography variant="body1" fontWeight="medium">
            {item.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" >
            {item.email || 'employee@gmail.com'}
          </Typography>
        </Stack>
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
    }, registrationDate: (item) => (fDate(item.creationTime, 'dd-MM-yyyy')
    ),
    status: (item) => (
      <Switch
        checked={item.status === 'Active'}
        onChange={() => handleToggleStatus(item)}
        color="primary"
      />
    ),
  };
  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.employee.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          isDeleting.onFalse();
          deleteDialog.onFalse();
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t('Pages.Employee.this_employee', { var: items?.find((item) => item.id === selectedEmployeeId)?.name || '' })
            })
          );
          isDeleting.onFalse();
          deleteDialog.onFalse();
          invalidateTag(FetchTags.EmployeesList);
        }
      })();
    },
    [deleteDialog, isDeleting, t, selectedEmployeeId, items]
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
              router.push(paths.controlPanel.users.employee.edit(item.id));
            },
          },
          {
            label: 'Global.Action.delete',
            icon: ICONS.global.delete,

            onClick: (item) => {
              setselectedEmployeeId(item.id);
              deleteDialog.onTrue();
            },
            sx: { color: 'error.main' },
          },
        ]}
      />
      <ConfirmDeleteDialog
        name={t('Pages.Employee.this_employee', { var: items?.find((item) => item.id === selectedEmployeeId)?.name || '' })}
        action={() => selectedEmployeeId && handleDelete(selectedEmployeeId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}
