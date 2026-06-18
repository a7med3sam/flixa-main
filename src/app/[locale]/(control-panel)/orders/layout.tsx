import { getTranslations } from 'next-intl/server';

interface Props {
  children: React.ReactNode;
}

export default function CategoriesLayout({ children }: Props) {
  return children;
}

export async function generateMetadata({ params }: { params: Promise<any> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.ReturnedOrder' });

  return {
    title: t('title'),
  };
}
