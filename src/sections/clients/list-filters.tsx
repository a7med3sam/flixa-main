'use client';
import dayjs from 'dayjs';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'src/components/use-query';
import { Clients, TotalStatus } from 'src/types/clients';
import { Box, Tab, Tabs, Grid2, TextField, IconButton, Typography } from '@mui/material';

interface Props {
  items?: Clients[];
  totalStatus: TotalStatus;
}

// Define status options with their properties
const STATUS_OPTIONS = [
  {
    value: '',
    name: 'Pages.Drivers.status.all',
    key: 'totalCount',
    bgColor: '#f0f0f0',
    color: '#000'
  },
  {
    value: 'active',
    name: 'Pages.Drivers.status.active',
    key: 'totalActive',
    bgColor: '#e8f5e9',
    color: '#2e7d32'
  },
  {
    value: 'blocked',
    name: 'Pages.Drivers.status.blocked',
    key: 'totalBlocked',
    bgColor: '#ffebee',
    color: '#c62828'
  }
];

export default function ClientsListFilter({ items:_, totalStatus }: Props) {
  const t = useTranslations();
  const { values, changeQueries } = useQuery(
    ['page', 'limit', 'createdrFilterDate', 'search', 'status'],
    true
  );

  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState(values.search || '');
  const [debouncedSearch] = useDebounce(search, 500);

  // Sync tab with query on mount
  useEffect(() => {
    const statusIndex = STATUS_OPTIONS.findIndex(option => option.value === values.status);
    setTabValue(statusIndex >= 0 ? statusIndex : 0);
  }, [values.status]);

  useEffect(() => {
    if (debouncedSearch !== values.search) changeQueries({ search: debouncedSearch, page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    changeQueries({
      status: STATUS_OPTIONS[newValue].value || undefined,
      page: '1'
    });
  };

  return (
    <Grid2
      container
      spacing={2}
      alignItems="center"
      justifyItems={"center"}
      justifyContent="space-between"
      sx={{ my: 0.8,px:2.5 }}
    >
      <Grid2 size={{ xs: 12, sm:6 }} container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
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
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label={t('Global.Label.start_date')}
            slotProps={{
              field: {
                clearable: true,
                onClear: () => changeQueries({ createdrFilterDate: undefined, page: '1' }),
              },
              textField: { fullWidth: true },
            }}
            value={values.createdrFilterDate ? dayjs(values.createdrFilterDate) : undefined}
            onChange={(value) => {
              changeQueries({ createdrFilterDate: value?.format('YYYY-MM-DD'), page: '1' });
            }}
          />
        </Grid2>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 'auto' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid #ddd', mt: 2 }}
        >
          {STATUS_OPTIONS.map((option, _index) => (
            <Tab
              key={option.value || 'all'}
              label={
                <Box display="flex" alignItems="center" gap={1} flexDirection="row-reverse">
                  <Typography variant="body2">
                    {t(option.name)}
                  </Typography>
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
                    {totalStatus[option.key as keyof TotalStatus] ?? 0}
                  </Box>
                </Box>
              }
              sx={{
                textTransform: 'none',
                minHeight: '40px',
                color: '#000',
                fontWeight: 500,
              }}
            />
          ))}
        </Tabs>
      </Grid2>
    </Grid2>
  );
}