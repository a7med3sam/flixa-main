'use client';
import dayjs from 'dayjs';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'src/components/use-query';
import { Order, OrderStatus, PaymentMethod } from 'src/types/order';
import {
  Tab,
  Box,
  Tabs,
  Grid2,
  TextField,
  Container,
  Typography,
  IconButton,
  Autocomplete,
} from '@mui/material';


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
  {
     name: 'Pages.Orders.OrderStatus.returned',
     bgColor: '#C62828',
     value: 'Returned',
     color: '#fff' }, // return-color
  { name: 'Pages.Orders.OrderStatus.PartiallyReturned',
    bgColor: '#fa16aa',
    value: 'partiallyReturned',
    color: '#fff' },

];

interface Props {
  items?: Order[];
  paymentMethodItems: PaymentMethod[];
  totalStatus: OrderStatus | {};
}

export default function OrderListFilters({ items, paymentMethodItems, totalStatus }: Props) {
  const t = useTranslations();
  const { values, changeQueries } = useQuery(
    ['page', 'limit', 'status', 'search', 'PaymentMethodId', 'OrderId', 'OrderDate'],
    true
  );
 // Add new state + debounce for OrderId
const [orderId, setOrderId] = useState(values.OrderId || '');
const [debouncedOrderId] = useDebounce(orderId, 500);

// Update query when debouncedOrderId changes
useEffect(() => {
  if (debouncedOrderId !== values.OrderId) {
    changeQueries({ OrderId: debouncedOrderId, page: '1' });
  }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [debouncedOrderId]);
  const [tabValue, setTabValue] = useState(0);


  // Map backend totalStatus to counts by value
  const statusCounts: { [key: string]: number } = {
    '': (totalStatus as OrderStatus)?.total || 0,
    Pending: (totalStatus as OrderStatus)?.pending || 0,
    Processing: (totalStatus as OrderStatus)?.processing || 0,
    Shipped: (totalStatus as OrderStatus)?.shipped || 0,
    Delivered: (totalStatus as OrderStatus)?.delivered || 0,
    Canceled: (totalStatus as OrderStatus)?.canceled || 0,
    Returned: (totalStatus as OrderStatus)?.returned || 0,
    partiallyReturned: (totalStatus as OrderStatus)?.partiallyReturned || 0,
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const selectedStatus = STATUS_OPTIONS[newValue]?.value || '';
    changeQueries({ status: selectedStatus });
  };
  return (
    <Container>
      <Grid2 container spacing={1} py={1}>
        {/* // use here debounce */}
        <Grid2 size={{ xs: 12, sm: items ? 6 : 12 }}>
          <TextField
            variant="outlined"
            placeholder={t('Global.Label.search') + '...'}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setOrderId(e.target.value);
               }}
               value={orderId}
               InputProps={{
                endAdornment: orderId ? (
                  <IconButton onClick={() => setOrderId('')} sx={{ "& .svg-color": { width: '1rem', height: '1rem' } }}>
                    {ICONS.global.x}
                  </IconButton>
                ) : null,
              }}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 3 }}>
          <Autocomplete
            value={paymentMethodItems.find((item) => item.id === values?.PaymentMethodId) || null}
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
         {/* Date Picker */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <DatePicker
            label={t('Pages.Orders.order_date')}
            slotProps={{
              field: {
                clearable: true,
                onClear: () => changeQueries({ OrderDate: undefined, page: '1' }),
              },
              textField: { fullWidth: true },
            }}
            value={values.OrderDate ? dayjs(values.OrderDate) : null}
            onChange={(value) => {
              changeQueries({
                OrderDate: value ? value.format('YYYY-MM-DD') : '',
                page: '1',
              });
            }}
          />
        </Grid2>
      </Grid2>


      {/* Tabs for status filter */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: '1px solid #ddd' }}
      >
        {STATUS_OPTIONS.map((option, index) => (
          <Tab
            key={option.value || 'all'}
            label={
              <Box display="flex" alignItems="center" gap={1} flexDirection="row-reverse">
                <Typography variant="body2">{t(option.name)}</Typography>
                <Box
                  sx={{
                    bgcolor: option.bgColor,
                    color: option.color,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    minWidth: '30px',
                    textAlign: 'center',
                  }}
                >
                  {statusCounts[option.value] || 0}
                </Box>
              </Box>
            }
            sx={{
              textTransform: 'none',
              minHeight: '40px',
              color: '#000',
              fontWeight: '500',
            }}
          />
        ))}
      </Tabs>
    </Container>
  );
}
