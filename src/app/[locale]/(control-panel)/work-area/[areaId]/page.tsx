import { WorkArea } from 'src/types/work-area';
import { endpoints } from 'src/utils/endpoints';
import { getTranslations } from 'next-intl/server';
import { getData } from 'src/utils/crud-fetch-api';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import NewEditWorkingArea from 'src/sections/work-area/views/new-edit-view';

export default async function Page({ params }: { params: Promise<{ areaId: string }> }) {
  const { areaId } = await params;

  const workareaDetails = await getData<WorkArea>(endpoints.workArea.single(areaId), {
    tags: [FetchTags.WorkArea],
  });

  if ('error' in workareaDetails) {
    if (workareaDetails.status === 403) {
    return <NoPermissionView />;
  }
  throw new Error(workareaDetails.error);
  }


  return <NewEditWorkingArea  workDetails={workareaDetails?.data}/>;
}

export async function generateMetadata({ params }: { params: Promise<any> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Offers' });

  return {
    title: t('title'),
  };
}
