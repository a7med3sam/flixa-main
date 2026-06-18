'use client';
import { Icon } from '@iconify/react';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { endpoints } from 'src/utils/endpoints';
import { editData } from 'src/utils/crud-fetch-api';
import { useLocale, useTranslations } from 'next-intl';
import { ReturnOrderDetails } from 'src/types/returned-order';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  Container,
  TextField,
  Typography,
  IconButton,
  CardContent,
  DialogTitle,
  ButtonProps,
  DialogContent,
  DialogActions,
} from '@mui/material';

import ReturnOrderItemsTable from '../list-table';
import ReasonAndNotesOfReturnsDetails from '../reason&notes';

interface Props {
  orderDetails: ReturnOrderDetails;
}

export default function ReturnedViewDetails({ orderDetails }: Props) {
  const [localOrderDetails, setLocalOrderDetails] = useState(orderDetails);
  const [openRefuseDialog, setOpenRefuseDialog] = useState(false);
  const [refuseReason, setRefuseReason] = useState('');
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    setLocalOrderDetails(orderDetails);
  }, [orderDetails]);

  const STATUS_OPTIONS = [
    {
      name: 'Pages.Orders.OrderStatus.reviwed',
      value: 'InProgress',
      bgColor: '#FFAB0029',
      color: '#B76E00',
    },
    {
      name: 'Pages.Orders.OrderStatus.acceptable',
      value: 'Accepted',
      bgColor: '#00A76F29',
      color: '#007867',
    },
    {
      name: 'Pages.Orders.OrderStatus.non_acceptable',
      value: 'Rejected',
      bgColor: '#FF563029',
      color: '#B71D18',
    },
  ];

  const statusTranslationMap: Record<string, string> = {
    InProgress: 'reviwed',
    Accepted: 'acceptable',
    Rejected: 'non_acceptable',
  };

  const getStatusColor = (status: string) => {
    const s = STATUS_OPTIONS.find((option) => option.value === status);
    return s
      ? { color: s.color, backgroundColor: s.bgColor }
      : { color: '#d9d9d9', backgroundColor: '#f0f0f0' };
  };

  const fields = useMemo(
    () => [
      {
        label: t('Pages.Orders.order_number'),
        value: localOrderDetails.orderNumber,
      },
      {
        label: t('Pages.Orders.returned_number'),
        value: localOrderDetails.returnOrderNumber,
      },
      {
        label: t('Pages.Orders.order_status'),
        value: (
          <Button
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              ...getStatusColor(localOrderDetails.status),
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 'bold',
              textTransform: 'none',
              pointerEvents: 'none',
            }}
          >
            {t(
              `Pages.Orders.OrderStatus.${statusTranslationMap[localOrderDetails.status] || 'all'
              }`
            )}
          </Button>
        ),
      },
      {
        label: t('Pages.Orders.products_count_returned'),
        value: localOrderDetails.orderItemsCount,
      },
      {
        label: t('Pages.Orders.order_value'),
        value: localOrderDetails.refundAmount.toFixed(2)
          + ' ' + t('Pages.Orders.currency'),
      },
      {
        label: t('Pages.Orders.driver'),
        value:
          localOrderDetails.driverName || t('Pages.Orders.not_assigned'),
      },
    ],
    [localOrderDetails, t]
  );

  const fields2 = useMemo(
    () => [
      {
        label: t('Pages.Orders.client_name'),
        value: localOrderDetails.clientName,
      },
      {
        label: t('Pages.Orders.client_phone'),
        value: localOrderDetails.phone,
      },
      {
        label: t('Pages.Orders.client_address'),
        value: localOrderDetails.address.name,
      },
      {
        label: t('Pages.Orders.client_email'),
        value: localOrderDetails.email,
      },
      {
        label: t('Pages.Orders.order_date'),
        value: new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ar-EG', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date(localOrderDetails.orderDate)),
      },
      {
        label: t('Pages.Orders.returned_time'),
        value: new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ar-EG', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date(localOrderDetails.returnedDate)),
      },
    ],
    [localOrderDetails, locale, t]
  );

  const handleChange = useCallback(
    async (id: string, status: 'Accepted' | 'Rejected', reason?: string) => {
      try {
        // Construct the correct URL with query parameters
        const url = `${endpoints.returnOrders.patch(id)}?status=${encodeURIComponent(status)}&reason=${encodeURIComponent(reason || '')}`;

        // Make PATCH request without body (since params are in URL)
        const res = await editData(url, 'PATCH', {});

        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(res.message || t('Global.Message.success'), { variant: 'success' });
          router.push(paths.controlPanel.returnOrders.list);
        }
      } catch (error) {
        enqueueSnackbar(error.message || t('Global.Message.error'), { variant: 'error' });
      }
    },
    [router, t]
  );


  const handleOpenRefuseDialog = () => setOpenRefuseDialog(true);
  const handleCloseRefuseDialog = () => {
    setRefuseReason('');
    setOpenRefuseDialog(false);
  };

  const handleConfirmRefuse = async () => {
    await handleChange(localOrderDetails.id, 'Rejected', refuseReason);
    handleCloseRefuseDialog();
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Pages.Orders.single_order') + localOrderDetails.orderNumber}
        links={[
          { name: t('Nav.orders'), href: paths.controlPanel.returnOrders.list },
          { name: t('Pages.Orders.single_order') + localOrderDetails.orderNumber },
        ]}
        activeLast
      />

      <Card>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-around"
            spacing={2}
            alignItems={'center'}
          >
            {/* Map */}
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #ccc',
              }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, width: '100%', height: '100%' }}
                src={`https://www.google.com/maps?q=${localOrderDetails.address.latitude},${localOrderDetails.address.longitude}&z=15&output=embed`}
                allowFullScreen
                loading="lazy"
              />
            </Box>

            {/* Client Info */}
            <Stack spacing={1}>
              {fields2.map((item) => (
                <Typography key={item.label}>
                  <Typography color="primary" fontWeight={700} component="span">
                    {item.label} :
                  </Typography>{' '}
                  {item.value}
                </Typography>
              ))}
            </Stack>

            {/* Order Info */}
            <Stack spacing={1}>
              {fields.map((item) => (
                <Typography key={item.label}>
                  <Typography color="primary" fontWeight={700} component="span">
                    {item.label} :
                  </Typography>{' '}
                  {item.value}
                </Typography>
              ))}
            </Stack>

            {/* Action Buttons */}
            {orderDetails.status === 'InProgress' && (
              <Stack
                spacing={2}
                alignItems="center"
                flexDirection={{ xs: 'row', md: 'column' }}
              >
                <IconButton
                  sx={{
                    bgcolor: '#E0F2F1',
                    borderRadius: 2,
                    width: 40,
                    height: 30,
                    '&:hover': { bgcolor: '#B2DFDB' },
                  }}
                  onClick={() => handleChange(localOrderDetails.id, 'Accepted')}
                >
                  <Icon icon="ic:baseline-check" width="24" />
                </IconButton>

                <ExpandableButton variant="contained" onClick={handleOpenRefuseDialog}>
                  <Icon icon="mdi:close-circle" width="20" />
                  <span className="text">{t('Pages.Orders.returned_refused')}</span>
                </ExpandableButton>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <ReturnOrderItemsTable
          orderItems={localOrderDetails.orderItems}
          totalCount={localOrderDetails.orderItemsCount}
        />
      </Card>

      <ReasonAndNotesOfReturnsDetails
        reason={orderDetails.reason}
        notes={orderDetails?.orderNote}
      />

      {/* Refuse Reason Dialog */}
      <Dialog open={openRefuseDialog} onClose={handleCloseRefuseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {t('Pages.Orders.returned_refused')}
          <IconButton onClick={handleCloseRefuseDialog}>
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('Pages.Orders.reason')}
            value={refuseReason}
            onChange={(e) => setRefuseReason(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRefuseDialog}>{t('Global.Action.cancel')}</Button>
          <Button onClick={handleConfirmRefuse} variant="contained" color="error">
            {t('Global.Action.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

const ExpandableButton = (props: ButtonProps) => (
  <Button
    sx={{
      bgcolor: '#E0F2F1',
      color: '#33691E',
      fontSize: '12px',
      borderRadius: 2,
      px: 1,
      py: 1,
      minWidth: '45px',
      maxWidth: '40px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      transition: 'max-width 0.3s ease-in-out, padding 0.3s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
        transition: 'opacity 0.3s ease-in-out, width 0.3s ease-in-out',
      },
      '&:hover .text': {
        opacity: 1,
        width: 'auto',
      },
      ...props.sx,
    }}
    {...props}
  />
);
