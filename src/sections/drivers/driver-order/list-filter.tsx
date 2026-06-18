'use client';
import React from 'react'
import dayjs from 'dayjs';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { PaymentMethod } from 'src/types/order';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'src/components/use-query';
import { Grid2, TextField, IconButton, Autocomplete } from '@mui/material';
const STATUS_OPTIONS = [
  { name: 'Pages.Orders.OrderStatus.all', bgColor: '#ABBFAB40', value: '', color: '#637381' }, // Gray
  {
    name: 'Pages.Orders.OrderStatus.new_order',
    bgColor: '#FFAB0029',
    value: 'Pending',
    color: '#B76E00',
  }, // Yellow
  {
    name: 'Pages.Orders.OrderStatus.in_progress',
    bgColor: '#00B8D929',
    value: 'Processing',
    color: '#006C9C',
  }, // Blue
  {
    name: 'Pages.Orders.OrderStatus.out_for_delivery',
    bgColor: '#8E33FF29',
    value: 'Shipped',
    color: '#5119B7',
  }, // Purple
  {
    name: 'Pages.Orders.OrderStatus.completed',
    bgColor: '#00A76F29',
    value: 'Delivered',
    color: '#007867',
  }, // Green
  {
    name: 'Pages.Orders.OrderStatus.canceled',
    bgColor: '#FF563029',
    value: 'Canceled',
    color: '#B71D18',
  }, // Red
];
interface Props {
  paymentMethodItems:PaymentMethod[]
} 

export default function ListFilterDriverOrder({paymentMethodItems}:Props) {
 const t = useTranslations();
//        'page' | 'limit' | 'status' | 'OrderNumber' | 'RegistrationDate' | 'PaymentMethodId',

  const { values: queries, changeQueries } = useQuery(
    ['page', 'limit', 'status', 'OrderNumber', 'RegistrationDate','PaymentMethodId'],
    true
  );

  const [search, setSearch] = useState(queries.OrderNumber);
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== queries.OrderNumber) changeQueries({ OrderNumber: debouncedSearch, page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Grid2 container spacing={1} py={3} px={2}>
      <Grid2 size={{ xs: 12, sm: 5 }}>
        <TextField
          variant="outlined"
          placeholder={t('Global.Label.search') + '...'}
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
          }}
          value={search || ''}
          slotProps={{
            input: {
              endAdornment: search ? (
                <IconButton
                  onClick={() => {
                    setSearch('');
                  }}
                  sx={{ '& .svg-color': { width: '1rem', height: '1rem' } }}
                >
                  {ICONS.global.x}
                </IconButton>
              ) : null,
            },
          }}
        />
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 7 }}>
        <Grid2 container spacing={1}>
          <Grid2 size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            value={paymentMethodItems.find((item) => item.id === queries?.PaymentMethodId) || null}
            options={paymentMethodItems}
            getOptionLabel={(option) => option.name || ''}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={t('Pages.Orders.paied_type')} />
            )}
            onChange={(_, value) => {
              changeQueries({ PaymentMethodId: value?.id || '', page: '1' });
            }}
          />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Autocomplete
              value={
                queries.status
                  ? STATUS_OPTIONS.find((option) => option.value === queries.status)
                  : { name: undefined, value: undefined }
              }
              options={STATUS_OPTIONS}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label={t('Global.Label.status')} />
              )}
              getOptionLabel={(option) => (option?.name ? t(option.name) : '')}
              getOptionKey={(option) => (option?.name ? t(option.name) : '')}
              onChange={(_, value) => {
                changeQueries({ status: value?.value?.toString(), page: '1' });
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <DatePicker
              label={t('Pages.Orders.order_date')}
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () => changeQueries({ RegistrationDate: undefined, page: '1' }),
                },
                textField: { fullWidth: true },
              }}
              value={queries.RegistrationDate ? dayjs(queries.RegistrationDate) : undefined}
              onChange={(value) => {
                changeQueries({ RegistrationDate: value?.format('YYYY-MM-DD'), page: '1' });
              }}
            />
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}