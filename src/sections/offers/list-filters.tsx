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
  { name: 'Global.Label.active', value: true },
  { name: 'Global.Label.inactive', value: false },
];

export default function OffersListFilters() {
  const t = useTranslations();
  const { values: queries, changeQueries } = useQuery(
    ['page', 'status', 'search', 'startDate', 'endDate'],
    true
  );

  const [search, setSearch] = useState(queries.search);
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== queries.search) changeQueries({ search: debouncedSearch, page: '1' });
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
            <DatePicker
              label={t('Global.Label.start_date')}
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () => changeQueries({ startDate: undefined, page: '1' }),
                },
                textField: { fullWidth: true },
              }}
              value={queries.startDate ? dayjs(queries.startDate) : undefined}
              onChange={(value) => {
                changeQueries({ startDate: value?.format('YYYY-MM-DD'), page: '1' });
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <DatePicker
              label={t('Global.Label.end_date')}
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () => changeQueries({ endDate: undefined, page: '1' }),
                },
                textField: { fullWidth: true },
              }}
              value={queries.endDate ? dayjs(queries.endDate) : undefined}
              onChange={(value) => {
                changeQueries({ endDate: value?.format('YYYY-MM-DD'), page: '1' });
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Autocomplete
              value={
                queries.status
                  ? STATUS_OPTIONS.find((option) => option.value === (queries.status === 'true'))
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
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
