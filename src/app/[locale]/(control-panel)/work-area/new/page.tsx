import { Product } from 'src/types/products';
import { endpoints } from 'src/utils/endpoints';
import { getTranslations } from 'next-intl/server';
import { getData } from 'src/utils/crud-fetch-api';
import { NoPermissionView } from 'src/sections/error';
import { FetchTags } from 'src/actions/config-actions';
import NewEditWorkingArea from 'src/sections/work-area/views/new-edit-view';

export default async function Page() {
  const productList = await getData<{ totalCount: number; items: Product[] }>(
    endpoints.product.list,
    { tags: [FetchTags.ProductsList] }
  );

  if ('error' in productList) {

if (productList.status === 403) {
    return <NoPermissionView />;
  }
  throw new Error(productList.error);
  }

  return <NewEditWorkingArea  />;
}

export async function generateMetadata({ params }: { params: Promise<any> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.WorksArea' });

  return {
    title: t('title'),
  };
}
