import { Product } from 'src/types/products';
import { endpoints } from 'src/utils/endpoints';
import { getTranslations } from 'next-intl/server';
import { getData } from 'src/utils/crud-fetch-api';
import { FetchTags } from 'src/actions/config-actions';
import NewEditOfferView from 'src/sections/offers/view/new-edit-view';

export default async function Page() {
  const productList = await getData<{ totalCount: number; items: Product[] }>(
    `${endpoints.product.list}?MaxResultCount=${100}`,
    { tags: [FetchTags.ProductsList] }
  );

  if ('error' in productList) {
    throw new Error(productList.error);
  }

  return <NewEditOfferView products={productList.data.items} />;
}

export async function generateMetadata({ params }: { params: Promise<any> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Offers' });

  return {
    title: t('title'),
  };
}
