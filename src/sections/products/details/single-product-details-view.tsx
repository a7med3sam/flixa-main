'use client';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { ProductDetails } from 'src/types/products';
import React, { useState, useCallback } from 'react';
import { deleteData } from 'src/utils/crud-fetch-api';
import { useCurrentLocale } from 'src/utils/locale-utils';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';
import { Box, Card, Stack, Grid2, Container, Typography, CardContent } from '@mui/material';

interface Props {
  productDetails: ProductDetails;
}

export default function SingleProductDetails({ productDetails }: Props) {
  const t = useTranslations('');
  const { value: locale } = useCurrentLocale();
  const deleteDialog = useBoolean();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const isDeleting = useBoolean();
  const router = useRouter();

  const labels = {
    NameAr: t('Global.Label.name_ar'),
    NameEn: t('Global.Label.name_en'),
    Barcode: t('Global.Label.barcode'),
    DescriptionAr: t('Global.Label.description_ar'),
    DescriptionEn: t('Global.Label.description_en'),
    Category: t('Global.Label.category'),
    SubCategory: t('Global.Label.subcategory'),
    MainUnit: t('Global.Label.main_unit'),
    Price: t('Global.Label.price'),
    IsActive: t('Global.Label.status'),
    Images: t('Global.Label.images'),
  };

  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.product.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t(`Pages.Products.product_title`),
            })
          );
          isDeleting.onFalse();
          router.push(paths.controlPanel.products.list);
        }
        deleteDialog.onFalse();
      })();
    },
    [deleteDialog, isDeleting, router, t]
  );

  return (
    <Container>
      {/* Top Description Grid */}
      <CustomBreadcrumbs
        heading={locale === 'ar' ? productDetails.nameAr : productDetails.nameEn}
        links={[
          { name: t('Nav.products'), href: paths.controlPanel.products.list },
          { name: locale === 'ar' ? productDetails.nameAr : productDetails.nameEn },
        ]}
        actions={[
          {
            variant: 'outlined',
            children: t('Global.Action.delete'),
            onClick: () => {
              setSelectedProductId(productDetails.id);
              deleteDialog.onTrue();
            },
            sx: { minWidth: 120, maxWidth: '100%' },
          },
          {
            children: t('Global.Action.edit'),
            variant: 'contained',
            onClick: () => {
              router.push(paths.controlPanel.products.single(productDetails.id));
            },
            sx: { minWidth: 120, maxWidth: '100%' },
          },
        ]}
        activeLast
      />

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography fontWeight="bold" color="primary.main" mb={0.5}>
                {labels.NameAr}:
              </Typography>
              <Typography mb={2}>{productDetails.nameAr}</Typography>
              <Typography fontWeight="bold" color="primary.main" mb={0.5} sx={{ mx: 1 }}>
                {labels.DescriptionAr}:
              </Typography>
              <Typography>{productDetails.descriptionAr}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography fontWeight="bold" color="primary.main" mb={0.5} sx={{ mx: 1 }}>
                {labels.NameEn}:
              </Typography>
              <Typography mb={2} sx={{ mx: 1 }}>
                {productDetails.nameEn}
              </Typography>
              <Typography fontWeight="bold" mb={0.5} color="primary.main" sx={{ mx: 1 }}>
                {labels.DescriptionEn}:
              </Typography>
              <Typography>{productDetails.descriptionEn}</Typography>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Specs Grid */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Grid2 display="flex" alignItems="center" sx={{ mx: 1 }}>
                <Typography color="primary.main" variant="h6">
                  {labels.Barcode} :
                </Typography>{' '}
                <Typography> {productDetails.barcode}</Typography>
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Grid2 display="flex" alignItems="center" sx={{ mx: 1 }}>
                <Typography color="primary.main" variant="h6" sx={{ mx: 1 }}>
                  {labels.IsActive}:
                </Typography>
                <Typography> {productDetails.isActive ? 'مفعل' : 'غير مفعل'}</Typography>
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Grid2 display="flex" alignItems="center" sx={{ mx: 1 }}>
                <Typography color="primary.main" variant="h6" sx={{ mx: 1 }}>
                  {labels.Category}:
                </Typography>
                <Typography> {productDetails?.category?.nameAr}</Typography>
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Grid2 display="flex" alignItems="center">
                <Typography color="primary.main" variant="h6" sx={{ mx: 1 }}>
                  {labels.SubCategory}:
                </Typography>
                <Typography> {productDetails?.category?.parentCategory?.nameAr}</Typography>
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Grid2 display="flex" alignItems="center">
                <Typography color="primary.main" variant="h6" sx={{ mx: 1 }}>
                  {labels.MainUnit}:
                </Typography>{' '}
                <Typography>
                  {' '}
                  {productDetails.productUnitOfMeasures
                    .map((item) =>
                      locale === 'ar' ? item.unitOfMeasureNameAr : item.unitOfMeasureNameEn
                    )
                    .join(', ')}
                </Typography>
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Grid2 display="flex" alignItems="center">
                <Typography color="primary.main" variant="h6" sx={{ mx: 1 }}>
                  {labels.Price}:{' '}
                </Typography>
                <Typography>
                  {productDetails.productUnitOfMeasures
                    .map((item) => `${item.price} رس`)
                    .join(', ')}
                </Typography>
              </Grid2>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            {labels.Images}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {productDetails?.productImages?.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img.url}
                alt={`product-${index}`}
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: 2,
                  objectFit: 'cover',
                  border: '1px solid #e0e0e0',
                  padding: 1,
                  backgroundColor: '#fafafa',
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
      <ConfirmDeleteDialog
        name={t('Pages.Products.product_title')}
        action={() => selectedProductId && handleDelete(selectedProductId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </Container>
  );
}
