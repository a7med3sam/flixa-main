import { paths } from 'src/routes/paths';
import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Offer } from 'src/types/marketings';
import { Product } from 'src/types/products';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NewEditOfferForm from '../new-edit-form';

interface Props {
  offer?: Offer;
  products: Product[];
}

export default function NewEditOfferView({ offer, products }: Props) {
  const t = useTranslations('Pages.Offers');

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t(offer ? 'edit_offer' : 'add_offer')}
        links={[
          { name: t('title'), href: paths.controlPanel.marketings.offers.list },
          { name: t(offer ? 'edit_offer' : 'add_offer') },
        ]}
        activeLast
      />

      <NewEditOfferForm offer={offer} products={products} />
    </Container>
  );
}
