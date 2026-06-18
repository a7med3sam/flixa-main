import { Grid2 } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Autocomplete } from '@mui/material';
import { useQuery } from 'src/components/use-query';
export default function BannerStatusFilter() {
    const STATUS_OPTIONS = [
        { name: 'Global.Label.active', value: true },
        { name: 'Global.Label.inactive', value: false },
      ];
      const t = useTranslations();
      const { values, changeQueries } = useQuery(
        ['status','page'],
        true
      );
  return (
    <Grid2 container spacing={1} py={3} px={2}>
    <Grid2 size={{ xs: 12, sm: 3 ,6:0}} >
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
  </Grid2> )
}
