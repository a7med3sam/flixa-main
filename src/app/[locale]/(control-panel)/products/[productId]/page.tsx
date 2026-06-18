import { Unit } from 'src/types/units';
import { Category } from 'src/types/categories';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { ProductDetails } from 'src/types/products';
import { FetchTags } from 'src/actions/config-actions';
import NewEditProductView from 'src/sections/products/view/new-edit-view';

interface Props {
  params: Promise<{ productId: string }>;
  searchParams: Promise<Record<'mainCategoryId', string | undefined>>;
}

export default async function Page({ params, searchParams }: Props) {
  const { productId } = await params;
  const { mainCategoryId } = await searchParams;

  const [product, categories, subCategories, units] = await Promise.all([
    getData<ProductDetails>(endpoints.product.single(productId)),
    getData<{ items: Category[] }>(`${`${endpoints.categories.list}?Limit=1000`}`, {
      tags: [FetchTags.CategoriesList],
    }),
    mainCategoryId
      ? getData<{ totalCount: number; items: Category[] }>(
          `${`${endpoints.subCategories.list}`}${mainCategoryId ? '?CategoryId=' + mainCategoryId : ''}`,
          { tags: [FetchTags.CategoriesList] }
        )
      : { data: { items: [] } },
    getData<{ items: Unit[] }>(`${`${endpoints.unitMeasure.list}?Limit=1000`}`, {
      tags: [FetchTags.UnitsList],
    }),
  ]);

  // Handle auth errors gracefully:
  // Server components render before client-side InitAuth refreshes the token,
  // so the first render may fail with an auth error. Return null and let the
  // client-side AuthGuard redirect to login once it detects unauthenticated state.
  const responses = [product, categories, subCategories, units];
  const authError = responses.find(
    (r) => 'error' in r && (r.status === 401 || /تسجيل|login|unauthorized/i.test(r.error))
  );
  if (authError && 'error' in authError) {
    // eslint-disable-next-line no-console
    console.warn('[products/edit] Auth error during data fetch:', authError.error);
    return null;
  }

  if ('error' in product) throw new Error(product.error);
  if ('error' in categories) throw new Error(categories.error);
  if ('error' in subCategories) throw new Error(subCategories.error);
  if ('error' in units) throw new Error(units.error);

  return (
    <NewEditProductView
      product={product.data}
      categories={categories.data.items}
      subCategories={subCategories.data.items}
      units={units.data.items}
    />
  );
}
