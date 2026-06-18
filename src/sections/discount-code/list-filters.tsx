'use client';
import dayjs from 'dayjs';
import { ICONS } from 'src/config-icons';
import { Coupon } from 'src/types/coupons';
import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from 'src/components/use-query';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Grid2, TextField, IconButton, Autocomplete } from '@mui/material';

const STATUS_OPTIONS = [
  { name: 'Global.Label.active', value: 'true' },
  { name: 'Global.Label.inactive', value: 'false' },
];

interface Props {
  items: Coupon[];
}

export default function CouponsListFilters({ items:_ }: Props) {
  const t = useTranslations();
  const { values, changeQueries } = useQuery(
    ['page', 'limit', 'status', 'Code', 'StartDate', 'EndDate'],
    true
  );
   const [Code, setCode] = useState(values.Code || '');
  const [debouncedCode] = useDebounce(Code, 500);
  useEffect(() => {
    if (debouncedCode !== values.Code) {
      changeQueries({ Code: debouncedCode, page: '1' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCode]);


  return (
    <Grid2 container spacing={1} py={3} px={1}>
      <Grid2 size={{ xs: 12, sm: 5 }}>
        <TextField
          variant="outlined"
          placeholder={t('Global.Label.search') + '...'}
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
          value={Code}
          slotProps={{
            input: {
              endAdornment: Code ? (
                <IconButton
                  onClick={() => {
                    setCode('');
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
              label={t('Global.Label.end_date')}
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () => changeQueries({ EndDate: undefined, page: '1' }),
                },
                textField: { fullWidth: true },
              }}
              value={values.EndDate ? dayjs(values.EndDate) : undefined}
              onChange={(value) => {
                changeQueries({ EndDate: value?.format('YYYY-MM-DD'), page: '1' });
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <DatePicker
              label={t('Global.Label.start_date')}
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () => changeQueries({ StartDate: undefined, page: '1' }),
                },
                textField: { fullWidth: true },
              }}
              value={values.StartDate ? dayjs(values.StartDate) : undefined}
              onChange={(value) => {
                changeQueries({ StartDate: value?.format('YYYY-MM-DD'), page: '1' });
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Autocomplete
              value={STATUS_OPTIONS.find((item) => item.value === values.status) || null}
              options={STATUS_OPTIONS}
              getOptionLabel={(option) => t(option.name)}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label={t('Global.Label.status')} />
              )}
              onChange={(_, value) =>
                changeQueries({ status: value?.value?.toString() || '', page: null })
              }
            />
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
