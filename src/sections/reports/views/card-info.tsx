

import React from 'react';
import { Report } from 'src/types/report';
import { useTranslations } from 'next-intl';
import { Box, Card, Typography } from '@mui/material';

interface Props {
  items: Report;
}

export default function CardInfoSquare({ items }: Props) {
  const t = useTranslations();

  const reportItems = [
    {
      title: t('Pages.Reports.Sales.totalSales'),
      value: items.totalSales,
      bgColor: '#C2E7F2', // Light blue
    },
    {
      title: t('Pages.Reports.Sales.deliveryFees'),
      value: items.deliveryFees,
      bgColor: '#E4E4E4', // Light gray
    },
    {
      title: t('Pages.Reports.Sales.paymentFees'),
      value: items.valueAddedTax,
      bgColor: '#E3D8D2', // Light brown/peach
    },
    {
      title: t('Pages.Reports.Sales.discounts'),
      value: items.discounts,
      bgColor: '#FBE7E7', // Light red
    },
    {
      title: t('Pages.Reports.Sales.netRevenue'),
      value: items.netRevenue,
      bgColor: '#D8EFDA', // Light green
    },
  ];

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      gap={2}
      dir="rtl"
      sx={{ width: '100%', mt: 2 }}
    >
      {reportItems.map((item, index) => (
        <Card
          key={index}
          sx={{
            flex: '1 1 18%',
            minWidth: '180px',
            backgroundColor: item.bgColor,
            borderRadius: 3,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            textAlign: 'center',
            p: 2.5,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {item.title}
          </Typography>
          <Typography
            variant="h6"
            fontWeight="bold"
            mt={1}
            sx={{ direction: 'ltr', fontSize: '1.25rem' }}
          >
            {item.value} <span style={{ fontSize: '0.85rem' }}>{t('Pages.Currency.symbol')}</span>
          </Typography>
        </Card>
      ))}
    </Box>
  );
}
