'use client';
import { ICONS } from 'src/config-icons';
import { TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/material';
import { Category } from 'src/types/categories';
import { Grid2, IconButton } from '@mui/material';
import { useQuery } from 'src/components/use-query';
import { useCurrentLocale } from 'src/utils/locale-utils';

const STATUS_OPTIONS = [
  { name: 'Global.Label.active', value: true },
  { name: 'Global.Label.inactive', value: false },
];

export default function CategoriesListFilters({
  parents,
  action,
}: {
  parents?: Category[];
  action?: React.ReactNode;
}) {
  const t = useTranslations();
  const { value: locale } = useCurrentLocale();
  const { values, changeQueries } = useQuery(
    ['status', 'search', 'parentId', 'parentName', 'page'],
    true
  );
  const [search, setSearch] = useState(values.search || '');
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== values.search) changeQueries({ search: debouncedSearch, page: '1' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Grid2 container spacing={1} py={3} px={2}>
      <Grid2 size={{ xs: 12, sm: parents || action ? 6 : 9 }}>
        <TextField
          variant="outlined"
          placeholder={t('Global.Label.search') + '...'}
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
          }}
          value={search || ""}
          slotProps={{
            input: {
              endAdornment: search ?(<IconButton onClick={() => {setSearch("")}} sx={{"& .svg-color": {width: "1rem", height: "1rem"}}}>{ICONS.global.x}</IconButton>): null
            }
          }}
        />
      </Grid2>

      {parents && !action && (
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <Autocomplete
            value={
              values.parentId
                ? parents?.find((option) => option.id === values.parentId)
                : { id: undefined, nameAr: undefined, nameEn: undefined }
            }
            options={parents}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={t('Pages.Categories.categories_title')}
              />
            )}
            getOptionLabel={(option) => {
              const name = option?.[locale === 'ar' ? 'nameAr' : 'nameEn'];
              return name || '';
            }}
            getOptionKey={(option) => (option?.id ? option.id : '')}
            onChange={(_, value) => {
              changeQueries({ parentId: value?.id, page: '1' });
            }}
            onInputChange={(_, value) => {
              changeQueries({ parentName: value });
            }}
          />
        </Grid2>
      )}

      <Grid2 size={{ xs: 12, sm: 3 }}>
        <Autocomplete
          value={
            values.status
              ? STATUS_OPTIONS.find((option) => option.value === (values.status === 'true'))
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
      {action && <Grid2 size={{ xs: 12, sm: 3 }}>{action}</Grid2>}
    </Grid2>
  );
}
