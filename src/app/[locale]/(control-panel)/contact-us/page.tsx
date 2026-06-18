import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { ContactUs } from 'src/types/static-page-type';
import ContactUsView from 'src/sections/contact-us/list-view';


export default async function Page( ) {
  

  const list = await getData<{ totalCount: number; items: ContactUs[] }>(
    endpoints.contactUs.list,
    { tags: [FetchTags.ContactUs] }
  );

  if ('error' in list) {
    if (list.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(list.error);
  }
  return <ContactUsView  data={list.data.items} />;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.ContactUs' });

  return {
    title: t('title'),
  };
}
