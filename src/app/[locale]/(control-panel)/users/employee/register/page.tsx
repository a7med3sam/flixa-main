import { getTranslations } from 'next-intl/server';
import EmployeeDetailsView from 'src/sections/employee/details/views/new-edit-view';


export default async function Page() {


  return (
    <EmployeeDetailsView  />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Categories' });

  return {
    title: t('title'),
  };
}
 