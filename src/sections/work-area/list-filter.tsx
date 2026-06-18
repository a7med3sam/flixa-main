'use client';
import React from 'react';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { WorkArea } from 'src/types/work-area';
import { useQuery } from 'src/components/use-query';
import { Grid2, TextField, IconButton, Autocomplete } from '@mui/material';

const STATUS_OPTIONS = [
  { name: 'Global.Label.active', value: true },
  { name: 'Global.Label.inactive', value: false },
];

interface Props {
  workAreas: WorkArea[];
}

export default function WorkAreaFilters({ workAreas:_ }: Props) {
  const t = useTranslations();
  const { values: queries, changeQueries } = useQuery(['page', 'limit', 'status', 'search'], true);

  const [search, setSearch] = useState(queries.search);
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== queries.search) changeQueries({ search: debouncedSearch, page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Grid2
      container
      spacing={2}
      py={3}
      px={2}
      display={'flex'}
      alignItems="center"
      justifyContent="flex-start"
    >
      <Grid2 size={{ xs: 12, sm: 8 }}>
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
  );
}
