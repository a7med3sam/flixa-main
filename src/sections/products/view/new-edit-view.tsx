import { Unit } from 'src/types/units';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { Box, Container } from '@mui/material';
import { Category } from 'src/types/categories';
import { ProductDetails } from 'src/types/products';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NewEditProductForm from '../new-edit-form';
import ProductFormInfo from '../new-edit-form/product-info';
import ProductFormAction from '../new-edit-form/form-action';
import ProductFormUnits from '../new-edit-form/product-units';
import ProductFormImages from '../new-edit-form/product-images';

interface Props {
  product?: ProductDetails;
  categories: Category[];
  subCategories: Category[];
  units: Unit[];
}

export default function NewEditProductView({ product, categories, subCategories, units }: Props) {
  const t = useTranslations();

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Pages.Products.product_title')}
        links={[
          { name: t('Pages.Products.product_title'), href: paths.controlPanel.products.list },
          { name: t('Pages.Products.add_product') },
        ]}
        activeLast
      />

      <NewEditProductForm
        product={product}
        categories={categories}
        subCategories={subCategories}
        units={units}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <ProductFormInfo sx={{ gridRow: { md: 'span 3' }, order: { sm: 2, md: 1 } }} />
          <ProductFormImages sx={{ order: { sm: 1, md: 2 } }} />
          <ProductFormUnits sx={{ order: 3 }} />

          <ProductFormAction
            sx={{ mt: 1, mb: 8, marginInlineStart: 'auto', minWidth: 'min(120px, 100%)', order: 4 }}
            size="large"
          />
          
        </Box>
      </NewEditProductForm>
    </Container>
  );
}
