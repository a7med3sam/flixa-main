'use client';
import dayjs from 'dayjs';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DriverStatus } from 'src/types/driver';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'src/components/use-query';
// import { Drivers } from 'src/types/drivers';
import { Tab, Box, Tabs, Grid2, TextField, Container, Typography, IconButton } from '@mui/material';

const STATUS_OPTIONS = [
  {
    name: 'Pages.Drivers.status.all',
    bgColor: '#ABBFAB40',
    value: '',
    color: '#637381',
    key: 'totalDrivers',
  },
  {
    name: 'Pages.Drivers.status.waiting',
    value: 'WaitingForApproval',
    bgColor: '#FFAB0029',
    color: '#B76E00',
    key: 'waitingForApprovalDrivers',
  },
  {
    name: 'Pages.Drivers.status.active',
    value: 'Active',
    bgColor: '#00A76F29',
    color: '#007867',
    key: 'activeDrivers',
  },
  {
    name: 'Pages.Drivers.status.blocked',
    bgColor: '#FF563029',
    color: '#B71D18',
    value: 'Blocked',
    key: 'blockedDrivers',
  },
];
interface Props {
  items?: DriverStatus[];
  totalStatus: DriverStatus | {};
}

export default function ListFiltersDrivers({ items, totalStatus }: Props) {
  const t = useTranslations();
  const { values, changeQueries } = useQuery(
    ['page', 'limit', 'search', 'registerDate', 'status'],
    true
  );
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState(values.search);
  const [debouncedSearch] = useDebounce(search, 500);
  useEffect(() => {
    if (debouncedSearch !== values.search) 
      changeQueries({ search: debouncedSearch, page: '1' });
  }, [debouncedSearch, values.search, changeQueries]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const selectedStatus = STATUS_OPTIONS[newValue]?.value || '';
    changeQueries({ status: selectedStatus, page: '1' });
  };

  return (
    <Container>
      <Box py={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Grid2
            size={{ xs: 12, sm: items ? 4 : 12 }}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <TextField
              variant="outlined"
              placeholder={t('Global.Label.search') + '...'}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
              }}
              value={search}
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
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DatePicker
              label={t('Pages.Drivers.select_date')}
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () => changeQueries({ registerDate: undefined, page: '1' }),
                },
                textField: { fullWidth: true },
              }}
              value={values.registerDate ? dayjs(values.registerDate) : undefined}
              onChange={(value: any) => {
                changeQueries({ registerDate: value?.format('YYYY-MM-DD'), page: '1' });
              }}
            />
          </Grid2>
        </Box>
        <Grid2 size={{ xs: 12, sm: 8 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            // variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: '1px solid #ddd', mt: 2 }}
          >
            {STATUS_OPTIONS.map((option, index) => (
              <Tab
                key={option?.value || 'all'}
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
                      {(totalStatus as any)?.[option.key] ?? 0}
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
      </Box>
    </Container>
  );
}
