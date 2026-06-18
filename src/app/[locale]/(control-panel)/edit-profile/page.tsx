import { getTranslations } from 'next-intl/server';
import EditViewProfile from 'src/sections/edit-profile/edit-view-profile';

export default async function Page() {
  return <EditViewProfile />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.PrivacyPolicy' });

  return {
    title: t('title'),
  };
}
