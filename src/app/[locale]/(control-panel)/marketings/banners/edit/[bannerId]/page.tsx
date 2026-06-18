import { Banner } from 'src/types/banner';
import { endpoints } from 'src/utils/endpoints';
import { getTranslations } from 'next-intl/server';
import { getData } from 'src/utils/crud-fetch-api';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import NewEditBannerView from 'src/sections/banners/new-banner/new-banners-view';

export default async function Page({ params }: { params: Promise<{ bannerId: string }> }) {
  const { bannerId } = await params;

  const banner = await getData<Banner>(endpoints.banners.single(bannerId), {
    tags: [FetchTags.BannersList],
  });

  if ('error' in banner) {
    if (banner.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(banner.error);
  }

  return <NewEditBannerView banner={banner.data} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Banners' });

  return {
    title: t('title'),
  };
}
