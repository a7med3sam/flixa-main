import { Banner } from 'src/types/banner';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import BannersView from 'src/sections/banners/view/banners-view';

interface Props {
  searchParams: Promise<Record<'page' | 'limit' | 'status', string | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, status } = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    ...(status && { IsActive: status }),
  });

  const BannersList = await getData<{ totalCount: number; items: Banner[] }>(
    `${endpoints.banners.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.BannersList] }
  );

  if ('error' in BannersList) {
    if (BannersList.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(BannersList.error);
  }

  return <BannersView totalCount={BannersList.data.totalCount} items={BannersList?.data?.items} />;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Banners' });

  return {
    title: t('title'),
  };
}
