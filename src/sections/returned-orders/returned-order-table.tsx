'use client';
import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { fDate } from 'src/utils/format-time';
import { ReturnedOrder } from 'src/types/returned-order';
import SharedTable from 'src/components/SharedTable/SharedTable';

const STATUS_STYLES: Record<string, { label: string; color: string; bgColor: string }> = {
  InProgress: {
    label: 'Pages.Orders.OrderStatus.reviwed',
    bgColor: '#FFAB0029',
    color: '#B76E00',
  }, // Yellow
  Accepted: {
    label: 'Pages.Orders.OrderStatus.acceptable',
    bgColor: '#00A76F29',
    color: '#007867',
  }, // Green
  Rejected: {
    label: 'Pages.Orders.OrderStatus.non_acceptable',
    bgColor: '#FF563029',
    color: '#B71D18',
  }, // red
};
interface Props {
  items: ReturnedOrder[];
  totalCount: number;
}

export default function ReturnedOrderTable({ items, totalCount }: Props) {
  const t = useTranslations();
  const router = useRouter();
  // Table Headere
  const TABLE_HEAD = [
    { id: 'orderNumber', label: 'Pages.Orders.order_number' },
    { id: 'returnedNumber', label: 'Pages.Orders.returned_number' },
    { id: 'clientName', label: 'Pages.Orders.client_name' },
    { id: 'returnedTime', label: 'Pages.Orders.returned_time' },
    { id: 'paymentMethodName', label: 'Pages.Orders.payment_method_name' },
    { id: 'totalOrderAmount', label: 'Pages.Orders.total_order_amount' },
    { id: 'driverName', label: 'Pages.Orders.driver_name' },
    { id: 'status', label: 'Pages.Orders.status' },
  ];

  const customRender: Record<string, (item: ReturnedOrder) => React.ReactNode> = useMemo(
    () => ({
      orderNumber: (item) => item.orderNumber,
      returnedNumber: (item) => item.returnOrderNumber,
      clientName: (item) => item.clientName,
      returnedTime: (item) => fDate(item.returnedDate, 'dd/MM/yyyy، hh:mm a'),
      paymentMethodName: (item) => item.paymentMethodName,
      totalOrderAmount: (item) => item.refundAmount.toFixed(2),
      driverName: (item) => (item?.driverName ? item.driverName : t('Pages.Orders.not_limited')),

      //  Status with colored badge
      status: (item) => {
        const statusInfo = STATUS_STYLES[item.status] || { label: item.status, color: '#999' };
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
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {t(statusInfo.label)}
          </Box>
        );
      },
    }),
    [t]
  );

  return (
    <SharedTable
      tableHead={TABLE_HEAD}
      data={items}
      customRender={customRender}
      count={totalCount}
      actions={[
        {
          label: 'Global.Action.view',
          icon: ICONS.global.eye,
          onClick: (items) => {
            router.push(paths.controlPanel.returnOrders.single(items.id));
          },
        },
      ]}
    />
  );
}
