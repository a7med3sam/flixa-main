'use client';
import dayjs from 'dayjs';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'src/components/use-query';
import { Grid2, TextField, IconButton, Autocomplete } from '@mui/material';

const STATUS_OPTIONS = [
  { name: 'Pages.Orders.client_name', value: 'Client' },
  { name: 'Pages.Orders.driver_name', value: 'Driver' },
];

export default function NotificationListFilter() {
  const t = useTranslations();
  const { values: queries, changeQueries } = useQuery(
    ['page', 'status', 'CreationDate', 'UserRole','Title'],
    true
  );
  const [search, setSearch] = useState(queries.Title);
  const [debouncedSearch] = useDebounce(search, 500);
  

  useEffect(() => {
    if (debouncedSearch !== queries.Title) changeQueries({ Title: debouncedSearch, page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);



  // Set default value to 'Client' if no UserRole is selected
  const defaultValue = STATUS_OPTIONS.find(option => option.value === 'Client');
  const selectedValue = queries.UserRole 
    ? STATUS_OPTIONS.find((option) => option.value === queries.UserRole)
    : defaultValue;

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

      <Grid2 size={{ xs: 12, sm: 3.5}}>
        <Autocomplete
          value={selectedValue}
          options={STATUS_OPTIONS}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={t('Global.Label.status')} />
          )}
          getOptionLabel={(option) => (option?.name ? t(option.name) : '')}
          onChange={(_, value) => {
            changeQueries({ 
              UserRole: value?.value?.toString(), 
              page: '1' 
            });
          }}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 3.5 }}>
        <DatePicker
          label={t('Pages.Notification.creation_time')}
          slotProps={{
            field: {
              clearable: true,
              onClear: () => changeQueries({ CreationDate: undefined, page: '1' }),
            },
            textField: { fullWidth: true },
          }}
          value={queries.CreationDate ? dayjs(queries.CreationDate) : undefined}
          onChange={(value) => {
            changeQueries({ CreationDate: value?.format('YYYY-MM-DD'), page: '1' });
          }}
        />
      </Grid2>
    </Grid2>
  );
}
