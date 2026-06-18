'use client';
import dayjs, { Dayjs } from 'dayjs';
import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { OrderStatus } from 'src/types/order';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'src/components/use-query';
import { ReturnedOrder } from 'src/types/returned-order';
import { Tab, Box, Tabs, Grid2, TextField, Container, Typography } from '@mui/material';

const STATUS_OPTIONS = [
  {
    name: 'Pages.Orders.OrderStatus.all',
    bgColor: '#ABBFAB40',
    value: '',
    color: '#637381',
    countKey: '',
  },
  {
    name: 'Pages.Orders.OrderStatus.reviwed',
    bgColor: '#FFAB0029',
    value: 'InProgress',
    color: '#B76E00',
    countKey: 'inProgress',
  },
  {
    name: 'Pages.Orders.OrderStatus.acceptable',
    bgColor: '#00A76F29',
    value: 'Accepted',
    color: '#007867',
    countKey: 'accepted',
  },
  {
    name: 'Pages.Orders.OrderStatus.non_acceptable',
    bgColor: '#FF563029',
    value: 'Rejected',
    color: '#B71D18',
    countKey: 'rejected',
  },
];

interface Props {
  items?: ReturnedOrder[];
  totalStatus: OrderStatus | {};
}

export default function ReturnedListFilter({ items, totalStatus }: Props) {
  const t = useTranslations();
  const { values, changeQueries } = useQuery(
    ['page', 'limit', 'OrderDate', 'search', 'Status'],
    true
  );
  const [tabValue, setTabValue] = useState(0);
  const [returnedDate, setReturnedDate] = useState<Dayjs | null>(
    values.OrderDate ? dayjs(values.OrderDate) : null
  );

  const [search, setSearch] = useState(values.search || '');
  const [debouncedSearch] = useDebounce(search, 500);

  // Sync tab with query on mount
  useEffect(() => {
    const index = STATUS_OPTIONS.findIndex((option) => option.value === values.Status);
    if (index !== -1) {
      setTabValue(index);
    }
  }, [values.Status]);
  useEffect(() => {
    if (debouncedSearch !== values.search) changeQueries({ search: debouncedSearch, page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const statusCounts: { [key: string]: number } = {
    '': (totalStatus as OrderStatus)?.total || 0,
    inProgress: (totalStatus as OrderStatus)?.inProgress || 0,
    accepted: (totalStatus as OrderStatus)?.accepted || 0,
    rejected: (totalStatus as OrderStatus)?.rejected || 0,
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const selectedStatus = STATUS_OPTIONS[newValue]?.value || '';
    changeQueries({ Status: selectedStatus, page: '1' });
  };

  const handleFilterByReturnedDate = (newValue: Dayjs | null) => {
    setReturnedDate(newValue);
    changeQueries({
      OrderDate: newValue ? newValue.format('YYYY-MM-DDTHH:mm:ss.SSSSSS') : '',
      page: '1',
    });
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
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DatePicker
              label={t('Pages.Orders.returned_time')}
              value={returnedDate}
              onChange={handleFilterByReturnedDate}
              format="YYYY-MM-DD"
            />
          </Grid2>
        </Box>
        <Grid2 size={{ xs: 12, sm: 8 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: '1px solid #ddd' }}
          >
            {STATUS_OPTIONS.map((option) => (
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
                      {statusCounts[option.countKey] ?? 0}
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
        </Grid2>
      </Box>
    </Container>
  );
}
