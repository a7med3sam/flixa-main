'use client';
import React from 'react';
import { Report } from 'src/types/report';
import { useTranslations } from 'next-intl';

interface Props {
  items: Report;
}

export default function CardInfoSquare({ items }: Props) {
  const t = useTranslations();

  const reportItems = [
    {
      title: t('Pages.Reports.Sales.totalSales'),
      value: items.totalSales,
      bgColor: '#C2E7F2',
    },
    {
      title: t('Pages.Reports.Sales.deliveryFees'),
      value: items.deliveryFees,
      bgColor: '#E4E4E4',
    },
    {
      title: t('Pages.Reports.Sales.paymentFees'),
      value: items.valueAddedTax,
      bgColor: '#E3D8D2',
    },
    {
      title: t('Pages.Reports.Sales.discounts'),
      value: items.discounts,
      bgColor: '#FBE7E7',
    },
    {
      title: t('Pages.Reports.Sales.netRevenue'),
      value: items.netRevenue,
      bgColor: '#D8EFDA',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full mt-3" dir="rtl">
      {reportItems.map((item, index) => (
        <div
          key={index}
          className="relative rounded-2xl px-5 py-4 flex flex-col gap-1.5 overflow-hidden"
          style={{
            backgroundColor: item.bgColor,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{
              backgroundColor: item.bgColor,
              filter: 'brightness(0.8)',
            }}
          />
          <div className="text-xs font-medium opacity-70">{item.title}</div>
          <div className="text-xl font-bold tracking-tight text-start" dir="ltr">
            {item.value}{' '}
            <span className="text-xs font-medium opacity-60">{t('Pages.Currency.symbol')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
