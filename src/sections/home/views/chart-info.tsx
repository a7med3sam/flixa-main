'use client';
import React from 'react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { SalesRevenue, PurchasedProduct } from 'src/types/home';
import { Box, Card, Stack, Paper, Typography } from '@mui/material';
import DateRangeFilter from 'src/sections/reports/filters/filters_by_range';
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

interface Props {
  items: PurchasedProduct[];
  salesRenveu?: SalesRevenue;
}

export default function SalesDashboard({ items: _, salesRenveu }: Props) {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const startDate = searchParams.get('StartDate');
  const endDate = searchParams.get('EndDate');

  // Helper to calculate the range
  // const calculateRangeType = () => {
  //   if (!startDate || !endDate) return 'week'; // default

  //   const start = dayjs(startDate);
  //   const end = dayjs(endDate);
  //   const diff = start.diff(end, 'day');

  //   if (diff === 0) return 'day';
  //   if (diff >= 6 && diff < 29) return 'week';
  //   if (diff >= 29) return 'month';
  //   return 'week';
  // };

  const calculateRangeType = () => {
  if (!startDate || !endDate) return 'day'; // default to "daily_report"

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diff = start.diff(end, 'day');

  if (diff === 0) return 'day';
  if (diff >= 6 && diff < 29) return 'week';
  if (diff >= 29) return 'month';
  return 'week';
};
  const currentRange = calculateRangeType();

  const titleMap = {
    day: t('Pages.Reports.daily_report'),
    week: t('Pages.Reports.weekly_report'),
    month: t('Pages.Reports.monthly_report')
  };

  const dynamicTitle = titleMap[currentRange];

  const dayNamesArabic = [
    t('Global.Date.sunday'),
    t('Global.Date.monday'),
    t('Global.Date.tuesday'),
    t('Global.Date.wednesday'),
    t('Global.Date.thursday'),
    t('Global.Date.friday'),
    t('Global.Date.saturday'),
  ];

  const chartData = salesRenveu?.homeDaySales?.map((entry) => ({
    name: dayNamesArabic[entry.dayOfWeek % 7],
    sales: entry.totalSales,
    revenue: entry.totalRevenue,
  })) ?? [];

  return (
    <Card sx={{
      mx: 2,
      p: 3,
      direction: 'rtl',
      borderRadius: 3,
      backgroundColor: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
    }}>
      {/* Total Cards */}
      <Stack direction="row" justifyContent="space-between" spacing={2} mb={4}>
        <Paper sx={{
          p: 2,
          flex: 1,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          color: 'white',
          borderRadius: '10px'
        }}>
          <Typography variant="h6">{t('Pages.Home.sales')}</Typography>
          <Typography variant="h4" fontWeight="bold">
            {salesRenveu?.totalSales ?? 0} {t('Pages.Currency.symbol')}
          </Typography>
        </Paper>

        <Paper sx={{
          p: 2,
          flex: 1,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
          color: 'white',
          borderRadius: '10px'
        }}>
          <Typography variant="h6">{t('Pages.Home.revenue')}</Typography>
          <Typography variant="h4" fontWeight="bold">
            {salesRenveu?.totalRevenue ?? 0} {t('Pages.Currency.symbol')}
          </Typography>
        </Paper>
      </Stack>

      {/* Area Chart */}
      <Box sx={{ height: 350 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <DateRangeFilter />
          <Typography variant="h6" fontWeight="bold">
            {dynamicTitle}
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#11998e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#11998e" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f39c12" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f39c12" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip
              contentStyle={{
                direction: 'rtl',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value, name) => {
                const displayName = name === 'sales' ? 'المبيعات' : 'الإيرادات';
                return [`${value} ر.س`, displayName];
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              name="المبيعات"
              stroke="#11998e"
              fillOpacity={1}
              fill="url(#colorSales)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="الإيرادات"
              stroke="#f39c12"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
