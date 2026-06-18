import { Product } from 'src/types/products';
import { Category } from 'src/types/categories';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import SubcategorySingleView from 'src/sections/categories/view/subcategory-single-view';

interface Props {
  params: Promise<{ subcategoryId: string }>;
  searchParams: Promise<Record<'parentName'|'page' | 'limit' | 'status' | 'search' , string | undefined>>;
}

export default async function Page({ params, searchParams }: Props) {
  const { subcategoryId } = await params;
  const { parentName  } = await searchParams;
  let {
    page ,
    limit ,
    status = '', // Default status (adjust as needed)
    search = '' // Default search query
  } = await searchParams;
    const urlSearchParams = new URLSearchParams({
      page: page || '1',
      limit: limit || DEFAULT_LIMIT.toString(),
      ...(status && { IsActive: status }),
      ...(search && { Name: search }),
       });
  let subcategoryById = await getData<Category>(endpoints.categories.single(subcategoryId));

  if ('error' in subcategoryById) {
    throw new Error(subcategoryById.error);
  }

  const parentCategory = await getData<Category>(
    endpoints.categories.single(subcategoryById.data.parentCategoryId || '')
  );

  if ('error' in parentCategory) {
    throw new Error(parentCategory.error);
  }

  subcategoryById.data.parentCategory = parentCategory.data;

  const categories = await getData<{ totalCount: number; items: Category[] }>(
    `${`${endpoints.categories.list}?Limit=1000`}?${parentName ? `Name=${parentName}&` : ''}Page=1&Limit=10`,
    { tags: [FetchTags.CategoriesList] }
  );

  if ('error' in categories) {
    throw new Error(categories.error);
  }
const productList = await getData<{ totalCount: number; items: Product[] }>(
    `${`${endpoints.product.list}?Limit=1000`}?CategoryId=${subcategoryId}&${urlSearchParams.toString()}`,
    { tags: [FetchTags.ProductsList] }
  );

  if ('error' in productList) {
    throw new Error(productList.error);
  }
  return (
    <SubcategorySingleView
      subCategory={subcategoryById.data}
      mainCategories={categories.data.items}
      products={productList?.data?.items}
      totalCount={productList?.data?.totalCount}
    />
  );
}
