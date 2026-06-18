'use client';
import { paths } from 'src/routes/paths';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery } from 'src/components/use-query';
import { TextField, Autocomplete } from '@mui/material';
import { Grid2, Button, IconButton } from '@mui/material';

const STATUS_OPTIONS = [
  { name: 'Global.Label.active', value: 'true' },
  { name: 'Global.Label.inactive', value: 'false' },
];

export default function ProductsListFiltersInSubCategory() {
  const t = useTranslations();
  const { values, changeQueries } = useQuery(['search', 'status', 'page', 'limit'], true);
  const router = useRouter();
  const [search, setSearch] = useState(values.search || '');
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== values.search) changeQueries({ search: debouncedSearch, page: '1' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Grid2 container spacing={2} py={3} px={2} alignItems="center">
       <Grid2 size={{ xs: 12, sm: 7 }} >
        <TextField
          value={search}
          variant="outlined"
          placeholder={t('Global.Label.search') + '...'}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: search ? (
              <IconButton onClick={() => setSearch('')} sx={{ "& .svg-color": { width: '1rem', height: '1rem' } }}>
                {ICONS.global.x}
              </IconButton>
            ) : null,
          }}
        />
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 3 }}>
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
      <Grid2 size={{ xs: 12, sm: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'primary.light',
            color: 'text.primary',
            borderRadius: 8,
            padding: '10px 20px',
            minWidth: 150,
            '&:hover': {
              backgroundColor: 'primary.light', // Prevent hover color change
            },
          }}
          onClick={() => router.push(paths.controlPanel.products.new)}

        >
          {t('Pages.Products.add_product')}
        </Button>
      </Grid2>
    </Grid2>
  );
}
