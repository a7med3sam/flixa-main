import { Unit } from 'src/types/units';
import { endpoints } from 'src/utils/endpoints';
import { getTranslations } from 'next-intl/server';
import { getData } from 'src/utils/crud-fetch-api';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import UnitsListView from 'src/sections/units/view/list-view';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<'page' | 'limit' | 'search', string | undefined>>;
}) {
  const { page, limit, search } = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    ...(search && { Name: search }),
  });

  const res = await getData<{ totalCount: number; items: Unit[] }>(
    `${endpoints.units.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.UnitsList] }
  );

  if ('error' in res) {
    if (res.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(res.error);
  }

  return <UnitsListView items={res.data.items} totalCount={res.data.totalCount} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Units' });

  return {
    title: t('title'),
  };
}
