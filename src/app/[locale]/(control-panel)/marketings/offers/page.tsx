import { Offer } from 'src/types/marketings';
import { endpoints } from 'src/utils/endpoints';
import { getTranslations } from 'next-intl/server';
import { getData } from 'src/utils/crud-fetch-api';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import OffersListView from 'src/sections/offers/view/list-view';

interface Props {
  searchParams: Promise<
    Record<'page' | 'limit' | 'status' | 'search' | 'startDate' | 'endDate', string | undefined>
  >;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, status, search, startDate, endDate } = await searchParams;
  page= page || '1';
  limit= limit || `${DEFAULT_LIMIT}`;

  const urlSearchParams = new URLSearchParams({
     SkipCount: `${(Number(page) - 1) * Number(limit)}`,
    MaxResultCount: limit,
    ...(status && { IsActive: status }),
    ...(search && { Search: search }),
    ...(startDate && { StartDate: startDate }),
    ...(endDate && { EndDate: endDate }),
  });

  const res = await getData<{ totalCount: number; items: Offer[] }>(
    `${endpoints.offers.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.OffersList] }
  );

  if ('error' in res) {
    if (res.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(res.error);
  }

  return <OffersListView {...res.data} />;
}
export async function generateMetadata({ params }: { params: Promise<any> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Offers' });

  return {
    title: t('title'),
  };
}
