import React from 'react';
import { Reports } from 'src/types/home';
import { useTranslations } from 'next-intl';
import { PurchasedProduct } from 'src/types/products';
import { useCurrentLocale } from 'src/utils/locale-utils';
import { Box, Card, Stack, Avatar, Typography } from '@mui/material';
import DateRangeFilter from 'src/sections/reports/filters/filters_by_range';



interface Props {
  items: PurchasedProduct[];
  reports: Reports;
}

export default function CardItemList({ items, reports:_ }: Props) {
  const t = useTranslations();
  const { value: locale } = useCurrentLocale();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight="bold" fontSize={16}>
            {t('Pages.Home.best_sellers')}
          </Typography>
          <DateRangeFilter />
        </Box>

        {/* Item List */}
        <Stack spacing={1}>
          {items.map((item) => (
            <Box
              key={item.productId}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2.1}
              border="1px solid transparent"
              borderRadius={2}
              sx={{
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              {/* Price */}
              <Typography
                color="success.main"
                fontWeight="bold"
                fontSize={14}
                textAlign="left"
                minWidth={60}
              >
                {item.productPrice?.toFixed(2) ?? '0.00'} {' '}  {t('Pages.Currency.symbol')}
              </Typography>

              {/* Info */}
              <Box flex={1} textAlign="right" mx={2}>
                <Typography fontSize={14} fontWeight="bold" lineHeight={1.4}>
                  {locale === 'ar' ? item.productNameAr : item.productNameEn}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {locale === 'ar' ? item.unitOfMeasureNameAr : item.unitOfMeasureNameEn}
                </Typography>
              </Box>

              {/* Image */}
              <Avatar
                variant="rounded"
                src={item.productImage}
                alt={item.productNameAr}
                sx={{ width: 44, height: 44 }}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
