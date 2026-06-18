import { endpoints } from 'src/utils/endpoints';
import { Category } from 'src/types/categories';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import CategoriesListView from 'src/sections/categories/view/list-view';

interface Props {
  searchParams: Promise<
    Record<'page' | 'limit' | 'status' | 'parentId' | 'parentName' | 'search', string | undefined>
  >;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, status, parentId, parentName, search } = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    ...(status && { IsActive: status }),
    ...(parentId && { CategoryId: parentId }),
    ...(search && { Name: search }),
  });

  const parentCategoriesParams = new URLSearchParams({
    page: '1',
    limit: '1000',
    ...(parentName && { Name: parentName }),
  });

  const categories = await getData<{ totalCount: number; items: Category[] }>(
    `${endpoints.categories.list}?${parentCategoriesParams.toString()}`,
    { tags: [FetchTags.CategoriesList] }
  );

  if ('error' in categories) {
    if(categories.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(categories.error);
  }

  const subCategories = await getData<{ totalCount: number; items: Category[] }>(
    `${endpoints.subCategories.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.CategoriesList] }
  );

  if ('error' in subCategories) {
    throw new Error(subCategories.error);
  }

  return (
    <CategoriesListView
      items={subCategories.data.items}
      totalCount={subCategories.data.totalCount}
      type="SUB_CATEGORY"
      parents={categories.data.items}
      viewParentName
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<any> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Categories' });

  return {
    title: t('title'),
  };
}
