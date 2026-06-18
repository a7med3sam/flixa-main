'use client';

import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { ICONS } from 'src/config-icons';
import { useRouter } from 'next/navigation';
import { endpoints } from 'src/utils/endpoints';
import { useFormat } from 'src/utils/format-time';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCurrency } from 'src/utils/format-number';
import { useLocale, useTranslations } from 'next-intl';
import { FetchTags } from 'src/actions/config-actions';
import ImageLink from 'src/components/image/image-link';
import { Offer, DiscountType } from 'src/types/marketings';
import BrokenImage from 'src/components/image/broken-image';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { editData, deleteData } from 'src/utils/crud-fetch-api';
import SharedTable from 'src/components/SharedTable/SharedTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Card, Stack, Switch, Container, Typography } from '@mui/material';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

import OffersListFilters from '../list-filters';

const TABLE_HEAD = [
  { id: 'productUnitOfMeasure', label: 'Global.Label.product' },
  { id: 'unit', label: 'Global.Label.unit' },
  { id: 'price', label: 'Global.Label.price' },
  { id: 'startDate', label: 'Global.Label.start_date' },
  { id: 'endDate', label: 'Global.Label.end_date' },
  { id: 'discountType', label: 'Global.Label.discount_type' },
  { id: 'discount', label: 'Global.Label.discount_amount' },
  { id: 'stockQuantity', label: 'Global.Label.stock_quantity' },
  { id: 'isActive', label: 'Global.Label.status' },
];

interface Props {
  items: Offer[];
  totalCount: number;
}

export default function OffersListView({ items, totalCount }: Props) {
  const t = useTranslations('');
  const locale = useLocale();
  const currency = useCurrency();
  const { formateDate } = useFormat();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [offersStatus, setOffersStatus] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((category) => [category.id, category.isActive]))
  );
  const disableChangeStatus = useBoolean();

  const deleteDialog = useBoolean();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const isDeleting = useBoolean();

  // update categories status on items change
  useEffect(() => {
    setOffersStatus(Object.fromEntries(items.map((offer) => [offer.id, offer.isActive])));
  }, [items]);

  const handleToggleStatus = useCallback(
    (id: string) => {
      if (disableChangeStatus.value) return;
      disableChangeStatus.onTrue();

      const originalStatus = offersStatus[id];
      setOffersStatus((prev) => {
        return {
          ...prev,
          [id]: !prev[id],
        };
      });
      (async () => {
        const res = await editData(endpoints.offers.patch(id), 'PATCH', {
          isActive: !originalStatus,
        });

        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          setOffersStatus((prev) => ({
            ...prev,
            [id]: originalStatus,
          }));
        } else {
          invalidateTag(FetchTags.OffersList);
        }
        disableChangeStatus.onFalse();
      })();
    },
    [offersStatus, disableChangeStatus, enqueueSnackbar]
  );

  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.offers.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          isDeleting.onFalse();
          deleteDialog.onFalse();
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t(`Global.Label.offer`),
            })
          );
          isDeleting.onFalse();
          deleteDialog.onFalse();
          invalidateTag(FetchTags.OffersList);
        }
      })();
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t]
  );

  const customRender: Record<string, (item: Offer) => React.ReactNode> = useMemo(
    () => ({
      productUnitOfMeasure: ({ productUnitOfMeasure }) => (
        <Stack direction="row" alignItems="center" spacing={3}>
          <ImageLink href={productUnitOfMeasure.productImageUrl}>
            <BrokenImage src={productUnitOfMeasure.productImageUrl} />
          </ImageLink>

          <Box>
            <Typography fontWeight="500">
              {productUnitOfMeasure[locale === 'ar' ? 'productNameAr' : 'productNameEn']}
            </Typography>
            <Typography color="text.secondary">{productUnitOfMeasure.productBarcode}</Typography>
          </Box>
        </Stack>
      ),
      unit: ({ productUnitOfMeasure }) =>
        productUnitOfMeasure[locale === 'ar' ? 'unitOfMeasureNameAr' : 'unitOfMeasureNameEn'],
      price: ({ productUnitOfMeasure }) => currency(productUnitOfMeasure.price),
      startDate: ({ startDate }) => formateDate(startDate),
      endDate: ({ endDate }) => formateDate(endDate),
      discountType: ({ discountType }) =>
        discountType === DiscountType.PERCENTAGE
          ? t('Global.Label.percentage')
          : t('Global.Label.fixed'),
      discount: ({ discount, discountType }) =>
        discountType === DiscountType.PERCENTAGE ? discount * 100 + '%' : currency(discount),
      isActive: (item) => (
        <Switch checked={!!offersStatus[item.id]} onChange={() => handleToggleStatus(item.id)} />
      ),
      stockQuantity: ({ productUnitOfMeasure }) => productUnitOfMeasure.stockQuantity,
    }),
    [locale, currency, formateDate, t, offersStatus, handleToggleStatus]
  );
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Pages.Offers.title')}
        links={[{}]}
        actions={[
          {
            children: t('Pages.Offers.add_offer'),
            onClick: () => router.push(paths.controlPanel.marketings.offers.new),
          },
        ]}
      />

      <Card>
        <OffersListFilters />

        <SharedTable
          tableHead={TABLE_HEAD}
          data={items}
          count={totalCount}
          customRender={customRender}
          actions={[
            {
              label: 'Global.Action.edit',
              icon: ICONS.global.edit,
              onClick: (item) => {
                router.push(paths.controlPanel.marketings.offers.edit(item.id));
              },
            },
            {
              label: 'Global.Action.delete',
              icon: ICONS.global.delete,
              onClick: (category) => {
                setSelectedOfferId(category.id);
                deleteDialog.onTrue();
              },
              sx: { color: 'error.main' },
            },
          ]}
        />
      </Card>

      <ConfirmDeleteDialog
        name={t(`Pages.Offers.offer`)}
        action={() => selectedOfferId && handleDelete(selectedOfferId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </Container>
  );
}
