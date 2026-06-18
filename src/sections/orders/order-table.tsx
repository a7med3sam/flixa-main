'use client';
import { Box } from '@mui/material';
import { Order } from 'src/types/order';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import { useMemo, useState } from 'react';
import { Drivers } from 'src/types/driver';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { fDate } from 'src/utils/format-time';
import SharedTable from 'src/components/SharedTable/SharedTable';

import EditStatusDialog from './view/edit-status';
import CancelOrderReason from './view/cancelde-order-reason';

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Pages.Orders.order_number' },
  { id: 'clientName', label: 'Pages.Orders.client_name' },
  { id: 'creationTime', label: 'Pages.Orders.creation_time' },
  { id: 'totalOrderAmount', label: 'Pages.Orders.total_order_amount' },
  { id: 'paymentMethodName', label: 'Pages.Orders.payment_method_name' },
  { id: 'isPaid', label: 'Pages.Orders.is_paid' },
  { id: 'driverName', label: 'Pages.Orders.driver_name' },
  { id: 'status', label: 'Pages.Orders.status' },
];

const STATUS_STYLES: Record<string, { label: string; color: string; bgColor: string }> = {
  Pending: { label: 'Pages.Orders.OrderStatus.new_order', bgColor: '#FFAB0029', color: '#B76E00' }, // Yellow
  Processing: {
    label: 'Pages.Orders.OrderStatus.in_progress',
    bgColor: '#00B8D929',
    color: '#006C9C',
  }, // Blue
  Shipped: {
    label: 'Pages.Orders.OrderStatus.out_for_delivery',
    bgColor: '#8E33FF29',
    color: '#5119B7',
  }, // Purple
  Delivered: {
    label: 'Pages.Orders.OrderStatus.completed',
    bgColor: '#00A76F29',
    color: '#007867',
  }, // Green
  Returned: { label: 'Pages.Orders.OrderStatus.returned', bgColor: '#C62828', color: '#fff' }, // return-color
  Canceled: { label: 'Pages.Orders.OrderStatus.canceled', bgColor: '#FF563029', color: '#B71D18' }, // Red
  PartiallyReturned:{ label: 'Pages.Orders.OrderStatus.PartiallyReturned', bgColor: '#fa16aa', color: '#fff' },
};

interface Props {
  items: Order[];
  totalCount: number;
  drivers:Drivers[];
}

export default function OrdersTable({ items, totalCount,drivers }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [selectedOrderReason, setSelectedOrderReason] = useState<Order | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogReason, setopenDialogReason] = useState(false);

  const customRender: Record<string, (item: Order) => React.ReactNode> = useMemo(
    () => ({
      orderNumber: (item) => item.orderNumber,
      clientName: (item) => item.clientName,
      creationTime: (item) => fDate(new Date(item.creationTime).toLocaleString('en-US', { timeZone: 'Asia/Riyadh' }), 'dd/MM/yyyy، hh:mm a'),
      totalOrderAmount: (item) =><Box sx={{px:2}}>{item.totalOrderAmount}</Box>,
      paymentMethodName: (item) => item.paymentMethodName,
      isPaid: (item) => (item?.isPaid?t('Pages.Orders.done'):t('Pages.Orders.not_done') ),
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
    <>
      <SharedTable
        tableHead={TABLE_HEAD}
        data={items}
        count={totalCount}
        customRender={customRender}
        actions={[
          {
            label: 'Pages.Orders.display_order',
            icon: ICONS.global.eye,
            onClick: (order) => {
              router.push(paths.controlPanel.orders.single(order.id));
            },
            sx: { '& .MuiListItemIcon-root rtl-y2uvon-MuiListItemIcon-root': { ml: 0 } }, // Ensure margin-left is 0
          },
          {
            label: 'Pages.Orders.update_status_order',
            icon: ICONS.global.settingsRounded,
            onClick: (order) => {
              setSelectedOrder(order);
              setOpenDialog(true);
            },
            sx: { color: 'primary.main' },
          },
          {
            hide: (item) => item.status !== 'Pending' && item.status !== 'Processing',
            label: 'Pages.Orders.order_canceled',
            icon: ICONS.global.deleteCircle,
            onClick: (order) => {
              setSelectedOrderReason(order);
              setopenDialogReason(true);
            },
            sx: { color: 'error.main' },
          },
        ]}
      />

      {openDialogReason && selectedOrderReason && (
        <CancelOrderReason
          open={openDialogReason}
          onClose={() => setopenDialogReason(false)}
          items={selectedOrderReason}
        />
      )}
      {/* Edit Status Dialog */}
      {openDialog && selectedOrder && (
        <EditStatusDialog
          items={selectedOrder}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          drivers={drivers}
        />
      )}
    </>
  );
}
