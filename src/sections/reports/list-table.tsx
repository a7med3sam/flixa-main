'use client';
import React from 'react';
import { useMemo } from 'react';
import { Switch } from '@mui/material';
import { fDate } from 'src/utils/format-time';
import { ReportOrder } from 'src/types/report';
import SharedTable from 'src/components/SharedTable/SharedTable';

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Pages.Orders.order_number' },
  { id: 'creationTime', label: 'Pages.Orders.creation_time' },
  { id: 'paymentMethodName', label: 'Pages.Orders.payment_method_name' },
  { id: 'totalOrderAmount', label: 'Pages.Orders.order_value' },
  { id: 'returns', label: 'Pages.Reports.returns' },
  { id: 'vatAmount', label: 'Pages.Reports.vat_amount' },
  { id: 'shippingFees', label: 'Pages.Reports.shipping_fees' },
  { id: 'discount', label: 'Pages.Reports.discount' },
  { id: 'netRevenue', label: 'Pages.Reports.net_revenue' },
];

interface Props {
  items: ReportOrder[];
  totalCount: number;
}
export default function ReportsOrderTable({ items, totalCount }: Props) {
  const customRender: Record<string, (item: ReportOrder) => React.ReactNode> = useMemo(
    () => ({
      orderNumber: (item) => item.orderNumber,
      creationTime: (item) => fDate(item.creationTime, 'dd/MM/yyyy، hh:mm a'),
      paymentMethodName: (item) => item.paymentMethodName,
      totalOrderAmount: (item) => item.totalOrderAmount,
      returns: (item) => (
        <Switch
          checked={item?.isReturned}
          disabled
          inputProps={{ 'aria-label': 'Read-only switch' }}
        />
      ),
      vatAmount: (item) => item?.vatAmount,
      shippingFees: (item) => item?.shippingCost,
      discount: (item) => item?.discount,
      netRevenue: (item) => item?.totalPrice,
    }),
    []
  );

  return (
    <>
      <SharedTable
        tableHead={TABLE_HEAD}
        data={items}
        count={totalCount}
        customRender={customRender}
      />
    </>
  );
}
