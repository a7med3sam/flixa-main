import { Grid2 } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Category } from 'src/types/categories';
import { UnitMeasure } from 'src/types/products';
import { useQuery } from 'src/components/use-query';
import { TextField, Autocomplete } from '@mui/material';
import { useCurrentLocale } from 'src/utils/locale-utils';

const STATUS_OPTIONS = [
  { name: 'Global.Label.active', value: 'true' },
  { name: 'Global.Label.inactive', value: 'false' },
];

export default function ProductsListFilters({
  categories = [],
  subCategories = [],
  units = [],
}: {
  subCategories?: Category[];
  categories?: Category[];
  units?: UnitMeasure[];
}) {
  const t = useTranslations();
  const { value: locale } = useCurrentLocale();
  const { values, changeQueries } = useQuery(
    ['search', 'unit', 'status', 'category', 'subCategory', 'page','stock'],
    true
  );
  return (
    <Grid2 container spacing={1} py={3} px={2}>
      <Grid2 size={8}>
        <TextField
          value={values.search || ''}
          variant="outlined"
          placeholder={t('Global.Label.search') + '...'}
          fullWidth
          onChange={(e) => changeQueries({ search: e.target.value, page: null })}
        />
      </Grid2>
      <Grid2 size={4}>
      <Autocomplete
        value={STATUS_OPTIONS.find((item) => item.value === values.stock) || null}
        options={STATUS_OPTIONS}
        getOptionLabel={(option) => t(option.name)}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label={t('Pages.Products.out_of_stock')} />
        )}
        onChange={(_, value) =>
          changeQueries({ stock: value?.value?.toString() || '', page: null })
        }
      />
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 3 }}>
        <Autocomplete
          value={categories.find((item) => item.id === values.category) || null}
          options={categories}
          getOptionLabel={(option) => option[locale === 'ar' ? 'nameAr' : 'nameEn'] || ''}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={t('Pages.Products.main_section')} />
          )}
          onChange={(_, value) => {
            const categoryId = value?.id || '';
            changeQueries({ category: categoryId, subCategory: null, page: null });
          }}
        />
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 3 }}>
        <Autocomplete
          value={subCategories.find((item) => item.id === values.subCategory) || null}
          options={subCategories}
          getOptionLabel={(option) => option[locale === 'ar' ? 'nameAr' : 'nameEn'] || ''}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={t('Pages.Products.sub_section')} />
          )}
          onChange={(_, value) => changeQueries({ subCategory: value?.id || '', page: null })}
        />
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 3 }}>
        <Autocomplete
          value={units.find((item) => item.id === values.unit) || null}
          options={units}
          getOptionLabel={(option) => option[locale === 'ar' ? 'nameAr' : 'nameEn'] || ''}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={t('Pages.Products.unit')} />
          )}
          onChange={(_, value) => changeQueries({ unit: value?.id || '', page: '1' })}
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
    </Grid2>
  );
}
