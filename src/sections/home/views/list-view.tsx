
'use client';
import React from 'react';
import { Box, Stack } from '@mui/material';
import { Reports, SettingItem, SalesRevenue, PurchasedProduct } from 'src/types/home';

import ChartInfo from './chart-info';
import CardItemList from './card-item-list';
import SquareCardItems from './square-card-info';
import DeliveryFreeProgress from './free-delivery-progress-bar';

interface Props {
  mostPurchaseProducts: PurchasedProduct[];
  reports: Reports;
  salesRenveu?: SalesRevenue;
  freeShipping: SettingItem[];
}


export default function HomeView({
  mostPurchaseProducts,
  reports,
  salesRenveu,
  freeShipping,
}: Props) {
  return (
    <>
      {/* 1. This component already works by stacking vertically on mobile */}
      <Box sx={{p:2}}>
        <SquareCardItems items={reports} />

      </Box>

      {/* 2. Main content area: Make it responsive */}
      <Stack
        mt={2}
        alignItems={'flex-start'}

        // --- RESPONSIVENESS APPLIED HERE ---
        sx={{
          // Default for mobile (small screens): Stack items vertically
          flexDirection: 'column',

          // For tablets and desktops (medium screens and up): Stack items horizontally
          '@media (min-width: 900px)': { // 'md' breakpoint and up
            flexDirection: 'row',
          },
        }}
        // ------------------------------------
      >
        {/* CardItemList (Most Purchased Products) */}
        <Box
          sx={{
            width: '100%', // Take full width on mobile
            // For tablets and desktops (md and up): Use 38% width
            '@media (min-width: 900px)': {
              width: '38%',
            },
            px:2
          }}
        >
          <CardItemList
            items={mostPurchaseProducts}
            reports={reports}
          />
        </Box>

        {/* ChartInfo and DeliveryFreeProgress */}
        <Box
          sx={{
            width: '100%', // Take full width on mobile
            marginTop: { xs: 2, md: 0 }, // Add top margin on mobile, none on desktop
            borderRadius: 3,
            // For tablets and desktops (md and up): Use 62% width
            '@media (min-width: 900px)': {
              width: '62%',
            },
          }}
        >
          <ChartInfo items={mostPurchaseProducts} salesRenveu={salesRenveu} />
          <Stack direction="row" width="100%" p={2}>
            <DeliveryFreeProgress reports={reports} freeShipping={freeShipping} />
          </Stack>
        </Box>
      </Stack>
    </>
  );
}