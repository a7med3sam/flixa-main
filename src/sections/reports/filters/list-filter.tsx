'use client';
import React from 'react';
import dayjs from 'dayjs';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { ReportOrder } from 'src/types/report';
import { PaymentMethod } from 'src/types/order';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'src/components/use-query';
import { Grid2, TextField, IconButton, Autocomplete } from '@mui/material';

interface Props {
  items: ReportOrder[];
  paymentMethodItems: PaymentMethod[];
}
export default function ListFilterReportOrders({ paymentMethodItems = [] }: Props) {
  const t = useTranslations();
  const { values: queries, changeQueries } = useQuery(
    ['page', 'PaymentMethodName', 'RegistrationDate', 'OrderNumber', 'StartDate', 'EndDate'],
    true
  );

  const [search, setSearch] = useState(queries.OrderNumber);
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== queries.OrderNumber)
      changeQueries({ OrderNumber: debouncedSearch, page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Grid2 container spacing={1} py={3} px={2}>
      <Grid2 size={{ xs: 12, sm: 7 }}>
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

      <Grid2 size={{ xs: 12, sm: 5 }}>
        <Grid2 container spacing={1}>
          <Grid2 size={{ xs: 12, sm: 5 }}>
            <Autocomplete
              value={
                paymentMethodItems.find((item) => item.name === queries.PaymentMethodName) || null
              }
              options={paymentMethodItems}
              getOptionLabel={(option) => option.name || ''}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label={t('Pages.Orders.paied_type')} />
              )}
              onChange={(_, value) => {
                changeQueries({ PaymentMethodName: value?.name || '', page: '1' });
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 5 }}>
            <DatePicker
              label={t('Pages.Orders.creation_time')}
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
          <Grid2 size={{ xs: 12, sm: 2 }}></Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
