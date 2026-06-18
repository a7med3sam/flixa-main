import { WorkArea } from 'src/types/work-area';
import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import WorkAreaView from 'src/sections/work-area/views/list-view';

interface Props {
  searchParams: Promise<Record<'page' | 'limit' | 'status'|'search', string | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, status,search } = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    ...(status && { IsActive: status }),
    ...(search && { Name: search }),

  });

  const WorksAreaList = await getData<{ totalCount: number; items: WorkArea[] }>(
    `${endpoints.workArea.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.WorkArea] }
  );

// Handle 403 error by checking the specific status or message
if ('error' in WorksAreaList) {
  if (WorksAreaList.status === 403) {
    return <NoPermissionView />;
  }
  throw new Error(WorksAreaList.error);
}
  return <WorkAreaView WorkAreas={WorksAreaList?.data?.items} totalCount={WorksAreaList?.data?.totalCount}  />;

}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.WorksArea' });

  return {
    title: t('title'),
  };
}
