import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DeliveryFees } from 'src/types/delivery-fees';
import { DEFAULT_LIMIT } from 'src/components/constant';
import DeliveryFeesView from 'src/sections/delivery-fees/views/list-view';

interface Props {
  searchParams: Promise<Record<'page' | 'limit' ,string | undefined>>;
}

export default async function Page({ searchParams }: Props ) {

  let { page, limit} = await searchParams;

  const urlSearchParams = new URLSearchParams({
 page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,

  });

  const list = await getData<{data:{ totalCount: number; items: DeliveryFees[] }}>(
    `${endpoints.DeliveryFees.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.DeliveryFees] }
  );

  if ('error' in list) {
    if (list.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(list.error);
  }
  return <DeliveryFeesView  data={list?.data?.data?.items} totalCount={list?.data?.data?.totalCount} />;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.DeliveryFees' });

  return {
    title: t('title'),
  };
}
