import { endpoints } from 'src/utils/endpoints';
import { Category } from 'src/types/categories';
import { getData } from 'src/utils/crud-fetch-api';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import { Product, UnitMeasure } from 'src/types/products';
import ProductsListView from 'src/sections/products/view/list-view';

interface Props {
  searchParams: Promise<
    Record<
      'page' | 'limit' | 'status' | 'search' | 'unit' | 'category' | 'subCategory'|'stock',
      string | undefined
    >
  >;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, status, search, unit, category, subCategory,stock } = await searchParams;

  page= page || '1';
  limit= limit || DEFAULT_LIMIT.toString();
  const urlSearchParams = new URLSearchParams({
     SkipCount: `${(Number(page) - 1) * Number(limit)}`,
    MaxResultCount: limit,
    ...(status && { IsActive: status }),
    ...(stock && { IsOutOfStock: stock }),
    ...(search && { Name: search }),
    ...(unit && { MainUnitId: unit }),
    ...(subCategory && { CategoryId: subCategory }),
  });

  const [products, categories, subCategories, unitMeasure] = await Promise.all([
    getData<{ totalCount: number; items: Product[] }>(
      `${`${endpoints.product.list}`}?${urlSearchParams.toString()}`,
      { tags: [FetchTags.ProductsList] }
    ),
    getData<{ totalCount: number; items: Category[] }>(`${`${endpoints.categories.list}?Limit=100`}`, {
      tags: [FetchTags.CategoriesList],
    }),
    getData<{ totalCount: number; items: Category[] }>(
      `${`${endpoints.subCategories.list}`}${category ? '?CategoryId=' + category : ''}`,
      { tags: [FetchTags.CategoriesList] }
    ),
    getData<{ totalCount: number; items: UnitMeasure[] }>(`${`${endpoints.unitMeasure.list}`}`, {
      tags: [FetchTags.UnitsList],
    }),
  ]);

  if ('error' in products) {
    if(products.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(products.error);
  }

  if ('error' in categories) {
    if(categories.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(categories.error);
  }

  if ('error' in subCategories) {
    if(subCategories.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(subCategories.error);
  }

  if ('error' in unitMeasure) {
    if(products.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(unitMeasure.error);
  }

  return (
    <ProductsListView
      products={products.data.items}
      totalCount={products?.data?.totalCount}
      categories={categories?.data?.items}
      subCategories={subCategories.data.items}
      units={unitMeasure?.data?.items}
    />
  );
}
