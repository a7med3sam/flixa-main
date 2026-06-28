import { getTranslations } from 'next-intl/server';
import MessagesListView from 'src/sections/admin-dashboard/messages/messages-list-view';

export default async function MessagesPage() {
  return <MessagesListView />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.ContactUs' });

  return {
    title: t('title'),
  };
}

