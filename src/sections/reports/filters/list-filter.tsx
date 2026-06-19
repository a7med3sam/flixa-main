'use client';
import React from 'react';
import dayjs from 'dayjs';
import { useDebounce } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { ReportOrder } from 'src/types/report';
import { PaymentMethod } from 'src/types/order';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'src/components/use-query';
import { TextField, Autocomplete } from '@mui/material';
import Iconify from 'src/components/iconify';

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
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 py-4 px-3">
      {/* Search input */}
      <div className="sm:col-span-7">
        <div className="relative">
          <input
            type="text"
            placeholder={t('Global.Label.search') + '...'}
            value={search || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition pe-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-grey-500 dark:text-grey-400 hover:text-grey-700 dark:hover:text-grey-200 transition-colors"
            >
              <Iconify icon="mingcute:close-line" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Payment method + Date */}
      <div className="sm:col-span-5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-5">
            <Autocomplete
              value={
                paymentMethodItems.find((item) => item.name === queries.PaymentMethodName) || null
              }
              options={paymentMethodItems}
              getOptionLabel={(option) => option.name || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t('Pages.Orders.paied_type')}
                  size="small"
                />
              )}
              onChange={(_, value) => {
                changeQueries({ PaymentMethodName: value?.name || '', page: '1' });
              }}
            />
          </div>
          <div className="sm:col-span-5">
            <DatePicker
              label={t('Pages.Orders.creation_time')}
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () => changeQueries({ RegistrationDate: undefined, page: '1' }),
                },
                textField: { fullWidth: true, size: 'small' },
              }}
              value={queries.RegistrationDate ? dayjs(queries.RegistrationDate) : undefined}
              onChange={(value) => {
                changeQueries({ RegistrationDate: value?.format('YYYY-MM-DD'), page: '1' });
              }}
            />
          </div>
          <div className="sm:col-span-2" />
        </div>
      </div>
    </div>
  );
}
