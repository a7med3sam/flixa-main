'use client';

import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import React, { useMemo, useCallback } from 'react';
import { ClientItemDetails } from 'src/types/clients';
import { FetchTags } from 'src/actions/config-actions';
import ImageLink from 'src/components/image/image-link';
import BrokenImage from 'src/components/image/broken-image';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { editData, deleteData } from 'src/utils/crud-fetch-api';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';
import { Box, Card, Stack, Button, Typography, IconButton, CardContent } from '@mui/material';

interface Props {
  client: ClientItemDetails;
}

export default function ClientInfoCard({ client }: Props) {
  
  const t = useTranslations('');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const deleteDialog = useBoolean();
  const isDeleting = useBoolean();

  const handleStatusChange = useCallback(
    async (id: string, newStatus: 'Active' | 'Blocked') => {
      const res = await editData(endpoints.clients.editStatus(id), 'PATCH', {
        status: newStatus,
      });

      if ('error' in res) {
        enqueueSnackbar(res.error, { variant: 'error' });
        return false;
      } else {
        enqueueSnackbar(
          t('Global.Server.Success.var_updated', {
            var: t('Pages.Clients.account_status'),
          }),
          { variant: 'success' }
        );
        invalidateTag(FetchTags.ClientsList);
        return true;
      }
    },
    [enqueueSnackbar, t]
  );

  const handleToggleStatus = useCallback(
    (item: ClientItemDetails) => {
      const newStatus = item.isActive ? 'Blocked' : 'Active';
      handleStatusChange(item.id, newStatus);
    },
    [handleStatusChange]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      isDeleting.onTrue();
      try {
        const res = await deleteData(endpoints.clients.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: 'Pages.Clients.client_name',
            }),
            { variant: 'success' }
          );
          router.push(paths.controlPanel.users.clients.list);
        }
      } finally {
        isDeleting.onFalse();
        deleteDialog.onFalse();
      }
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t, router]
  );

  const actionButtons = [
    {
      icon: 'tabler:trash',
      expandable: true,
      onClick: () => deleteDialog.onTrue(),
      text: t('Global.Action.delete'),
    },
    {
      icon: client.status === 'Active' ? 'mdi:block-helper' : 'mdi:check-circle-outline',
      onClick: () => handleToggleStatus(client),
      expandable: true,
      text: client.isActive ? t('Global.Action.block') : t('Global.Action.active'),
    },
  ];

  const fields = useMemo(
    () => [
      { label: t('Pages.Clients.client_name'), value: client.name },
      { label:  t('Pages.Clients.client_phone'), value: client.phoneNumber },
      { label: t('Pages.Clients.client_address'), value: client.addressDescription || '-' },
    ],
    [client,t]
  );

  const fields1 = useMemo(
    () => [
      { label:  t('Pages.Clients.account_date'), value: new Date(client.creationTime).toLocaleDateString() },
      { label:  t('Pages.Clients.account_status'), value: client.status=="Active" ? t('Global.Label.active') : t('Global.Label.inactive'),},
    ],
    [client, t]
  );

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
            <ImageLink href={client.profileImage || ''}>
              <BrokenImage
                src={client.profileImage}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </ImageLink>
            <Box flex={1}>
              <Stack spacing={2}>
                {fields.map(({ label, value }) => (
                  <Typography key={label}>
                    <Typography component="span" fontWeight={700} color="primary">
                      {label} :
                    </Typography>{' '}
                    {value}
                  </Typography>
                ))}
              </Stack>
            </Box>
            <Box flex={1}>
              <Stack spacing={2}>
                {fields1.map(({ label, value }) => (
                  <Typography key={label}>
                    <Typography component="span" fontWeight={700} color="primary">
                      {label} :
                    </Typography>{' '}
                    {value}
                  </Typography>
                ))}
              </Stack>
            </Box>
            <Box flex={0.5}>
              <Stack spacing={1}>
                {actionButtons.map((button, index) =>
                  button.expandable ? (
                    <Button
                      key={index}
                      variant="contained"
                      sx={{
                        bgcolor: '#E0F2F1',
                        color: '#33691E',
                        fontSize: '12px',
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                        minWidth: '56px',
                        maxWidth: '60px',
                        minHeight: '56px',
                        maxHeight: '60px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        gap: 1,
                        '&:hover': {
                          bgcolor: '#B2DFDB',
                          maxWidth: '160px',
                          px: 2,
                          justifyContent: 'flex-start',
                        },
                        '& .text': {
                          opacity: 0,
                          width: 0,
                          transition: 'all 0.3s ease',
                        },
                        '&:hover .text': {
                          opacity: 1,
                          width: 'auto',
                        },
                      }}
                      onClick={button.onClick}
                    >
                      <Icon icon={button.icon} width="20" />
                      <span className="text">{button.text}</span>
                    </Button>
                  ) : (
                    <IconButton
                      key={index}
                      sx={{
                        bgcolor: '#E0F2F1',
                        borderRadius: 2,
                        width: 40,
                        height: 40,
                        '&:hover': { bgcolor: '#B2DFDB' },
                      }}
                      onClick={button.onClick}
                    >
                      <Icon icon={button.icon} width="24" />
                    </IconButton>
                  )
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        name={t('Pages.Clients.this_client', {
          var: client.name,
        })}
        action={() => handleDelete(client.id)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}
