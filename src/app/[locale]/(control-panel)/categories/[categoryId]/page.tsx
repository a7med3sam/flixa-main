import { Category } from 'src/types/categories';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { FetchTags } from 'src/actions/config-actions';
import CategorySingleView from 'src/sections/categories/view/category-single-view';

interface Props {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<
    Record<'parentName' | 'page' | 'limit' | 'status' | 'search', string | undefined>
  >;
}


export default async function Page({ params, searchParams }: Props) {
  const { categoryId } = await params;
  const { parentName, page, limit, status, search } = await searchParams;

  const categoryById = await getData<Category>(endpoints.categories.single(categoryId));

  if ('error' in categoryById) {
    throw new Error(categoryById.error);
  }
  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || '5',
    CategoryId: categoryId,
    ...(status && { IsActive: status }),
    ...(search && { Name: search }),
  });

  const subCategories = await getData<{ totalCount: number; items: Category[] }>(
    `${endpoints.subCategories.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.CategoriesList] }
  );

  if ('error' in subCategories) {
    throw new Error(subCategories.error);
  }

  const allCategories = await getData<{ totalCount: number; items: Category[] }>(
    `${`${endpoints.categories.list}?Limit=1000`}?${parentName ? `Name=${parentName}&` : ''}Page=1&Limit=10`,
    { tags: [FetchTags.CategoriesList] }
  );

  if ('error' in allCategories) {
    throw new Error(allCategories.error);
  }

  return (
    <CategorySingleView
      category={categoryById.data}
      items={subCategories.data.items}
      totalCount={subCategories.data.totalCount}
      parents={allCategories.data.items}
    />
  );
}
