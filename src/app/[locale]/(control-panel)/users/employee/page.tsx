import { Employee } from 'src/types/employee';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import EmployeeListView from 'src/sections/employee/views/list-view';

interface Props {
  searchParams: Promise<Record<'page' | 'limit' | 'RegistrationDate' | 'Name'|'status' , string | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, RegistrationDate, Name ,status} = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    RegistrationDate: RegistrationDate || '',
    ...(Name && { SearchByName: Name }),
    ...(status && { Status: status }),

  });

  const res = await getData<{ totalCount: number; items: Employee[] }>(
    `${endpoints.employee.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.EmployeesList] }
  );

  if ('error' in res) {
    if (res.status === 403) {
    return <NoPermissionView />;
  }

    throw new Error(res.error);
  }

  return (
    <EmployeeListView items={res.data.items} totalCount={res.data.totalCount} />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Categories' });

  return {
    title: t('title'),
  };
}
 