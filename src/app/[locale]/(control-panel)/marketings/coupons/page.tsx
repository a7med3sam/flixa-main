import { Coupon } from 'src/types/coupons';
import { endpoints } from 'src/utils/endpoints';
import { getTranslations } from 'next-intl/server';
import { getData } from 'src/utils/crud-fetch-api';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import CouponsView from 'src/sections/discount-code/view/coupons-view';

interface Props {
  searchParams: Promise<
    Record<'page' | 'limit' | 'status' | 'Code' | 'StartDate' | 'EndDate', string | undefined>
  >;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, status, Code, StartDate, EndDate } = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || '5',
    Code: Code || '',
    StartDate: StartDate || '',
    EndDate: EndDate || '',
    ...(status && { IsActive: status }),
  });

  const res = await getData<{ totalCount: number; items: Coupon[] }>(
    `${endpoints.barcodeDiscount.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.BarcodeDiscount] }
  );

  if ('error' in res) {
    if (res.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(res.error);
  }
  return <CouponsView items={res?.data?.items} totalCount={res?.data?.totalCount} />;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Coupons' });

  return {
    title: t('title'),
  };
}
