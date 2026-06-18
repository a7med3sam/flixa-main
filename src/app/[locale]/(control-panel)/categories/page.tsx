import { endpoints } from 'src/utils/endpoints';
import { Category } from 'src/types/categories';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import CategoriesListView from 'src/sections/categories/view/list-view';

interface Props {
  searchParams: Promise<Record<'page' | 'limit' | 'status' | 'search', string | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, status, search } = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    ...(status && { IsActive: status }),
    ...(search && { Name: search }),
  });

  const res = await getData<{ totalCount: number; items: Category[] }>(
    `${`${endpoints.categories.list}`}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.CategoriesList] }
  );

  if ('error' in res) {
    if (res.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(res.error);
  }

  return (
    <CategoriesListView items={res.data.items} totalCount={res.data.totalCount} type="CATEGORY" />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Categories' });

 return {
    title: t('title'),
  };
}
 