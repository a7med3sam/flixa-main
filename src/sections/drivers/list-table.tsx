'use client';
import { useCallback, useState } from 'react';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import { Drivers } from 'src/types/driver';
import { useRouter } from 'next/navigation';
import { Box, Avatar } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { fDate } from 'src/utils/format-time';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteData, editData } from 'src/utils/crud-fetch-api';
import { useLocale, useTranslations } from 'next-intl';
import { FetchTags } from 'src/actions/config-actions';
import { invalidateTag } from 'src/actions/cache-invalidation';
import SharedTable from 'src/components/SharedTable/SharedTable';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

const STATUS_STYLES: Record<string, { label: string; color: string; bgColor: string }> = {
  WaitingForApproval: {
    label: 'Pages.Drivers.status.waiting',
    bgColor: '#FFAB0029',
    color: '#B76E00',
  },
  Active: {
    label: 'Pages.Drivers.status.active',
    bgColor: '#00A76F29',
    color: '#007867',
  },
  Blocked: {
    label: 'Pages.Drivers.status.blocked',
    bgColor: '#FF563029',
    color: '#B71D18',
  },
};

interface Props {
  items: Drivers[];
  totalCount: number;
}

export default function DriverTableView({ items, totalCount }: Props) {
  const deleteDialog = useBoolean();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale()
  const [, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const isDeleting = useBoolean();


  const moveFirstToLastIfArabic = (text: string) => {
    if (locale === 'ar' && text?.startsWith('+') && text.length > 1) {
      return text.slice(1) + '+';
    }
    return text;
  };
  const handleUpdateStatus = async (driverId: string, status: string) => {
    setLoading(true);

    const url = `${endpoints.drivers.editStatus(driverId)}?status=${status}`;
    const res = await editData(url, 'PUT', {});

    if ('error' in res) {
      enqueueSnackbar(res.error || 'Failed to update driver status', { variant: 'error' });
    } else {
      enqueueSnackbar(
        t('Global.Server.Success.var_updated', {
          var: t('Nav.Users.drivers'),
        }),
        { variant: 'success' }
      );
      invalidateTag(FetchTags.DriversList);
    }

    setLoading(false);
    deleteDialog.onFalse();
  };
  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.drivers.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: 'Pages.Clients.client_name',
            })
          );
          deleteDialog.onFalse();
          invalidateTag(FetchTags.DriversList);
        }
        isDeleting.onFalse();
      })();
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t]
  );

  const tableHead = [
    { id: 'status', label: 'Pages.Drivers.table.status' },
    { id: 'registrationDate', label: 'Pages.Drivers.table.registrationDate' },
    { id: 'idNumber', label: 'Pages.Drivers.table.idNumber' },
    { id: 'phoneNumber', label: 'Pages.Drivers.table.phoneNumber' },
    { id: 'email', label: 'Pages.Drivers.table.email' },
    { id: 'name', label: 'Pages.Drivers.table.name' },
    { id: 'profilePicture', label: 'Pages.Drivers.table.profile_picture' },
  ];

  const customRender: Record<string, (item: Drivers) => React.ReactNode> = {
    profilePicture: (item) => <Avatar alt={item.name} src={item.profilePicture} />,
    registrationDate: (item) => fDate(item.registrationDate, 'dd-MM-yyyy'),
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
    },
    status: (item) => {
      const statusInfo = STATUS_STYLES[item.status] || {
        label: item.status,
        color: '#999',
        bgColor: '#EEE',
      };
      return (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color,
            px: 1.5,
            py: 0.5,
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 'bold',
          }}
        >
          {t(statusInfo.label)}
        </Box>
      );
    },
  };

  return (
    <>
      <SharedTable
        tableHead={tableHead}
        data={items}
        customRender={customRender}
        count={totalCount}
        actions={[
          {
            label: 'Pages.Drivers.display_info',
            icon: ICONS.global.eye,
            onClick: (item) => {
              router.push(paths.controlPanel.users.drivers.single(item.id));
            },
          },
          {
            label: 'Pages.Drivers.display_orders',
            icon: ICONS.global.info,
            onClick: (item) => {
              item.name
              router.push(paths.controlPanel.users.drivers.driverOrders(item.id));
            },
          },
          {
            label: 'Global.Action.edit',
            icon: ICONS.global.edit,
            onClick: (item) => {
              router.push(paths.controlPanel.users.drivers.edit(item.id));
            },
          },
          {
            hide: (item) => item.status === 'Blocked',
            label: 'Global.Action.block',
            icon: ICONS.global.block,
            onClick: (item) => {
              handleUpdateStatus(item.id, 'Blocked');
            },
            sx: { color: 'error.main' },
          },
          {
            hide: (item) => item.status === 'Active',
            label: 'Global.Action.verify',
            icon: ICONS.global.active,
            onClick: (item) => {
              handleUpdateStatus(item.id, 'Active');
            },

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
        name={t('Pages.Drivers.this_driver', {
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
