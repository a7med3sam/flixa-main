import React, { useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import { OrderItem } from 'src/types/returned-order';
import ImageLink from 'src/components/image/image-link';
import BrokenImage from 'src/components/image/broken-image';
import SharedTable from 'src/components/SharedTable/SharedTable';

const TABLE_HEAD = [
  { id: 'imageUrl', label: 'Pages.Orders.prdcts' },
  { id: 'nameEn', label: 'Global.Label.name_en' },
  { id: 'barcode', label: 'Pages.Products.barcode' },
  { id: 'unit', label: 'Global.Label.unit' },
  { id: 'price', label: 'Global.Label.unit_price' },
  { id: 'quantity', label: 'Global.Label.quantity' },
  { id: 'totalPrice', label: 'Pages.Orders.total_price' },
];

interface Props {
  orderItems: OrderItem[];

  totalCount: number;
}

export default function ReturnOrderItemsTable({ orderItems, totalCount }: Props) {
const t=useTranslations();
  const customRender: Record<string, (orderItems: OrderItem) => React.ReactNode> = useMemo(
    () => ({

      imageUrl: (item) => {
        return (
          <Stack direction="row" alignItems="center" gap={4}>
            <ImageLink href={item.productImages?.[0]?.imageUrl || ''}>
              <BrokenImage src={item.productImages?.[0]?.imageUrl || ''} />
            </ImageLink>
            <Box>{item.name.nameAr}</Box>
          </Stack>
        );
      },
      nameEn: (item) => item.name.nameEn,
      barcode: (item) => (item.productBarcode ? item.productBarcode : '-'),
      unit: (item) => item.measurementUnit.nameAr,
      price: (item) => `${item.priceAtPurchaseWithVat.toFixed(2)} ${t('Pages.Currency.symbol')}`,
      quantity: (item) => item.quantity,
      totalPrice: (item) => `${item.totalPriceWithVat.toFixed(2)} ${t('Pages.Currency.symbol')}`,
    }),
    []
  );

  return (
    <SharedTable
      tableHead={TABLE_HEAD}
      data={orderItems}
      count={totalCount}
      customRender={customRender}
    />
  );
}
