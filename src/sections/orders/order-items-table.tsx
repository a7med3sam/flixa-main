import React, { useMemo } from 'react';
import { OrderItem } from 'src/types/order';
import ImageLink from 'src/components/image/image-link';
import { useCurrentLocale } from 'src/utils/locale-utils';
import BrokenImage from 'src/components/image/broken-image';
import SharedTable from 'src/components/SharedTable/SharedTable';

interface Props {
  orderItems: OrderItem[];
  totalCount: number;
}

export default function OrderItemsTable({ orderItems, totalCount }: Props) {
  const { value: locale } = useCurrentLocale();

  // Table Headers

  const TABLE_HEAD = [
    { id: 'productImage', label: 'Pages.Orders.prdcts' },
    { id: 'productNameAr', label: '' },
    { id: 'productNameEn', label: 'Global.Label.name_en' },
    { id: 'productBarcode', label: 'Pages.Orders.barcode' },
    { id: 'unitOfMeasure', label: 'Global.Label.unit' },
    { id: 'priceAtPurchase', label: 'Pages.Orders.unit_price' },
    { id: 'quantity', label: 'Pages.Orders.quantity' },
    { id: 'totalPrice', label: 'Pages.Orders.total_price' },
  ];

  const customRender: Record<string, (item: OrderItem) => React.ReactNode> = useMemo(
    () => ({
      productImage: (item) => (
        <ImageLink href={item?.productImage || ''}>
          <BrokenImage src={item?.productImage} />
        </ImageLink>
      ),
      productNameAr: (item) => item?.productNameAr,
      productNameEn: (item) => item?.productNameEn,
      productBarcode: (item) => item?.productBarcode,
      unitOfMeasure: (item) =>
        locale === 'ar' ? item?.unitOfMeasureNameAr : item?.unitOfMeasureNameEn,
      priceAtPurchase: (item) => item?.priceAtPurchaseWithVat.toFixed(2),
      quantity: (item) => item?.quantity,
      totalPrice: (item) => item?.totalPriceWithVat.toFixed(2),
    }),
    [locale]
  );

  return (
    <SharedTable
      tableHead={TABLE_HEAD}
      data={orderItems}
      customRender={customRender}
      count={totalCount}
      actions={[]}
    />
  );
}
