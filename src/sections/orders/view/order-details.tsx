'use client';
import { Icon } from '@iconify/react';
import { paths } from 'src/routes/paths';
import { Drivers } from 'src/types/driver';
import { useRouter } from 'next/navigation';
import { OrderDetailsType } from 'src/types/order';
import { useLocale, useTranslations } from 'next-intl';
import React, { useMemo, useState, useEffect } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  Box,
  Card,
  Stack,
  Button,
  Tooltip,
  Container,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

import EditStatusDialog from './edit-status';
import OrderItemsTable from '../order-items-table';
import CancelOrderReason from './cancelde-order-reason';
import NotesAndDetailsTotalOrder from '../notes-details-total-order';

interface Props {
  orderDetails: OrderDetailsType;
  drivers: Drivers[];
}

export default function OrderDetails({ orderDetails: initialOrderDetails , drivers }: Props) {
  const [localOrderDetails, setLocalOrderDetails] = useState(initialOrderDetails);
  const t = useTranslations();
  const locale = useLocale();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogReason, setopenDialogReason] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLocalOrderDetails(initialOrderDetails);
  }, [initialOrderDetails]);

  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((option) => option.value === status);
    return statusOption
      ? { color: statusOption.color, backgroundColor: statusOption.bgColor }
      : { color: '#d9d9d9', backgroundColor: '#f0f0f0' };
  };
  const moveFirstToLastIfArabic = (text: string) => {
  if (locale === 'ar' && text?.startsWith('+') && text.length > 1) {
    return text.slice(1) + '+';
  }
  return text;
};
  // Order Fields (Part 1)
  const fields = useMemo(
    () => [
      {
        label: t('Pages.Orders.order_number'),
        value: initialOrderDetails.orderNumber,
      },
      {
        label: t('Pages.Orders.order_status'),
        value: (
          <Button
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              ...getStatusColor(initialOrderDetails.status),
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
              `Pages.Orders.OrderStatus.${statusTranslationMap[initialOrderDetails.status] || 'all'}`
            )}
          </Button>
        ),
      },
      {
        label: t('Pages.Orders.order_value'),
        value: initialOrderDetails.pricing.totalOrderAmount + ' ' + t('Pages.Orders.currency'),
      },
      {
        label: t('Pages.Orders.payment_method'),
        value: initialOrderDetails.payment.paymentMethodName,
      },
      {
        label: t('Pages.Orders.payment_status'),
        value: initialOrderDetails.payment.transactionStatus
          ? t('Pages.Orders.PaymentStatus.success')
          : t('Pages.PaymentStatus.failed'),
      },
      {
        label: t('Pages.Orders.driver'),
        value: initialOrderDetails.driver?.name
          ? initialOrderDetails.driver.name
          : t('Pages.Orders.not_assigned'),
      },
    ],
    [
      initialOrderDetails.driver?.name,
      initialOrderDetails.orderNumber,
      initialOrderDetails.payment.paymentMethodName,
      initialOrderDetails.status,
      initialOrderDetails.pricing.totalOrderAmount,
      initialOrderDetails.payment.transactionStatus,
      t,
    ]
  );

  // Order Fields (Part 2)
  const fields2 = useMemo(
    () => [
      {
        label: t('Pages.Orders.client_name'),
        value: initialOrderDetails.client.name,
      },
      {
        label: t('Pages.Orders.client_phone'),
        value:moveFirstToLastIfArabic(initialOrderDetails.client.phone),
      },
      {
        label: t('Pages.Orders.client_address'),
        value: initialOrderDetails.address.description,
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
    timeZone: 'Asia/Riyadh', // ✅ Add this
  }).format(new Date(initialOrderDetails.creationTime)),
},
{
  label: t('Pages.Orders.last_update'),
  value: new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ar-EG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Riyadh', // ✅ Add this too
  }).format(new Date(initialOrderDetails.lastModificationTime)),
      },
    ],
    [locale, initialOrderDetails, t]
  );

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Pages.Orders.single_order') + initialOrderDetails.orderNumber}
        links={[
          { name: t('Nav.orders'), href: paths.controlPanel.orders.list },
          { name: t('Pages.Orders.single_order') + initialOrderDetails.orderNumber },
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
            {/* Order map location */}
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
                style={{
                  border: 0,
                  width: '100%',
                  height: '100%',
                }}
                src={`https://www.google.com/maps?q=${initialOrderDetails.address.latitude},${initialOrderDetails.address.longitude}&z=15&output=embed`}
                allowFullScreen
                loading="lazy"
              />
            </Box>

            {/* Order Details (Part 1) */}
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

            {/* Order Details (Part 2) */}
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

            {/* Action Buttons */}
            <Stack
              spacing={2}
              alignItems="center"
              flexDirection={{ xs: 'row', md: 'column' }} // Row on small screens, column on medium+
              justifyContent={{ xs: 'center', md: 'space-between' }} // Center align for small screens
            >
              {/* Close Button */}
              {initialOrderDetails.status === 'Pending' ||
              initialOrderDetails.status === 'Processing' ? (
                <Tooltip title={t('Nav.orders') + ' ' + t('Pages.Orders.OrderStatus.canceled')}>
                  <IconButton
                    sx={{
                      bgcolor: '#E0F2F1',
                      borderRadius: 2,
                      width: 40,
                      height: 30,
                      '&:hover': { bgcolor: '#B2DFDB' },
                    }}
                    onClick={() => {
                      setopenDialogReason(true);
                    }}
                  >
                    <Icon icon="ic:baseline-close" width="24" />
                  </IconButton>
                </Tooltip>
              ) : null}

              <Button
                variant="contained"
                sx={{
                  bgcolor: '#E0F2F1',
                  color: '#33691E',
                  fontSize: '12px',
                  borderRadius: 2,
                  px: 1,
                  py: 1,
                  minWidth: '45px', // Keeps the button size small initially
                  maxWidth: '40px', // Ensures icon is centered
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  transition: 'max-width 0.3s ease-in-out, padding 0.3s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', // Center icon when collapsed
                  gap: 1,
                  '&:hover': {
                    bgcolor: '#B2DFDB',
                    maxWidth: '160px', // Expand width on hover
                    px: 2,
                    justifyContent: 'flex-start', // Align icon + text
                  },
                  '& .text': {
                    opacity: 0, // Hide text initially
                    width: 0,
                    transition: 'opacity 0.3s ease-in-out, width 0.3s ease-in-out',
                  },
                  '&:hover .text': {
                    opacity: 1, // Show text on hover
                    width: 'auto',
                  },
                }}
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <Icon icon="mdi:file-edit-outline" width="20" />
                <span className="text">{t('Pages.Orders.change_order_status')}</span>
              </Button>

              {/* Document Button */}
              <IconButton
                sx={{
                  bgcolor: '#E0F2F1',
                  borderRadius: 2,
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: '#B2DFDB' },
                }}
              >
                <Icon icon="mdi:file-document-outline" width="24" />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <OrderItemsTable orderItems={initialOrderDetails.orderItems} totalCount={initialOrderDetails.orderItems.length}/>
      </Card>
      {/* // */}
      <NotesAndDetailsTotalOrder initialOrderDetails={initialOrderDetails} />
      {/* //Cancel Order */}
      <CancelOrderReason
        open={openDialogReason}
        onClose={() => {
          setopenDialogReason(false);
          router.push(paths.controlPanel.orders.single(localOrderDetails.id));
        }}
        items={localOrderDetails}
      />
      {/* //Change Order Status*/}
      <EditStatusDialog
        items={localOrderDetails}
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          router.push(paths.controlPanel.orders.single(localOrderDetails.id));
        }}
        drivers={drivers}
      />
    </Container>
  );
}

const STATUS_OPTIONS = [
  {
    name: 'Pages.Orders.OrderStatus.new_order',
    value: 'Pending',
    bgColor: '#FFAB0029',
    color: '#B76E00',
  }, // Yellow
  {
    name: 'Pages.Orders.OrderStatus.in_progress',
    value: 'Processing',
    bgColor: '#00B8D929',
    color: '#006C9C',
  }, // Blue
  {
    name: 'Pages.Orders.OrderStatus.out_for_delivery',
    value: 'Shipped',
    bgColor: '#8E33FF29',
    color: '#5119B7',
  }, // Purple
  {
    name: 'Pages.Orders.OrderStatus.completed',
    value: 'Delivered',
    bgColor: '#00A76F29',
    color: '#007867',
  }, // Green
  {
      name: 'Pages.Orders.OrderStatus.canceled',
    value: 'Canceled',
    bgColor: '#FF563029',
    color: '#B71D18',
  }, // Red
  {
    name: 'Pages.Orders.OrderStatus.returned',
    value: 'Returned',
    bgColor: '#C62828',
    color: '#fff',
  }, // Yellow
  { name: 'Pages.Order.Status.PartiallyReturned',
     bgColor: '#fa16aa',
     value: 'PartiallyReturned',
     color: '#fff' },

];

const statusTranslationMap: Record<string, string> = {
  Pending: 'new_order',
  Processing: 'in_progress',
  Shipped: 'out_for_delivery',
  Delivered: 'completed',
  Canceled: 'canceled',
  Returned: 'returned',
  PartiallyReturned:"PartiallyReturned"
};
