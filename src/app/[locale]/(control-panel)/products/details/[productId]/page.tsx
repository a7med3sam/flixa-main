import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { ProductDetails } from 'src/types/products';
import SingleProductDetails from 'src/sections/products/details/single-product-details-view';

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function Page({ params }: Props) {
  const { productId } = await params;

  const product = await getData<ProductDetails>(endpoints.product.single(productId));
  if ('error' in product) {
    throw new Error(product.error);
  }

  return (
   <SingleProductDetails productDetails={product.data} />
  );
}
