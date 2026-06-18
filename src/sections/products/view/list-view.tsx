'use client';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Category } from 'src/types/categories';
import { Card, Container } from '@mui/material';
import { Product, UnitMeasure } from 'src/types/products';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductsTable from '../products-table';
import ProductsListFilters from '../list-filters';

interface Props {
  products: Product[];
  categories: Category[];
  subCategories: Category[];
  totalCount: number;
  units: UnitMeasure[];
}

export default function ProductsListView({
  products,
  categories,
  subCategories,
  totalCount,
  units,
}: Props) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Pages.Products.product_title')}
        links={[{}]}
        actions={[
          {
            children: t('Pages.Products.add_product'),
            onClick: () => router.push(paths.controlPanel.products.new),
          },
        ]}
      />

      <Card>
        <ProductsListFilters categories={categories} subCategories={subCategories} units={units} />
        <ProductsTable
          items={products}
          totalCount={totalCount}
          onEdit={(product) => {
            router.push(paths.controlPanel.products.single(product.id));
          }}
        />
      </Card>
    </Container>
  );
}
