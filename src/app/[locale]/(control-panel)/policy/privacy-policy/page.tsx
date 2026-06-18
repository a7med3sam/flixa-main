import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import PolicyView from 'src/sections/policy/list-view';
import { StaticPage } from 'src/types/static-page-type';

interface Props {
  searchParams: Promise<Record<'status', string | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  let { status } = await searchParams;

  const privacy = 'PrivacyPolicy';
  const urlSearchParams = new URLSearchParams({
    ...(status && { pageType: status }),
  });

  const list = await getData<StaticPage>(
    `${endpoints.staticPages.list(privacy)}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.PrivacyPolicy] }
  );

  if ('error' in list) {
    if(list.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(list.error);
  }
  return <PolicyView type={privacy} data={list.data} />;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.PrivacyPolicy' });

  return {
    title: t('title'),
  };
}
