'use client';

import * as yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { paths } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { endpoints } from 'src/utils/endpoints';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNameValue } from 'src/utils/locale-utils';
import { FetchTags } from 'src/actions/config-actions';
import { Offer, DiscountType } from 'src/types/marketings';
import { Card, Grid2, Stack, Button } from '@mui/material';
import RHFSwitch from 'src/components/hook-form/rhf-switch';
import { invalidateTag } from 'src/actions/cache-invalidation';
import RHFDatePicker from 'src/components/hook-form/rhf-date-picker';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { getData, editData, postData } from 'src/utils/crud-fetch-api';
import RHFAutocomplete from 'src/components/hook-form/rhf-autocomplete';
import { Product, ProductDetails, ProductUnitOfMeasure } from 'src/types/products';

interface Props {
  offer?: Offer;
  products: Product[];
}

export default function NewEditOfferForm({ offer, products }: Props) {
  const t = useTranslations();
  const nameValue = useNameValue();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductDetails | null>(null);

  const labels = useMemo(
    () => ({
      product: t('Global.Label.product'),
      unit: t('Global.Label.unit'),
      unit_price: t('Global.Label.unit_price'),
      discountType: t('Global.Label.discount_type'),
      discountAmount: t('Global.Label.discount_amount'),
      newPrice: t('Global.Label.new_price'),
      startDate: t('Global.Label.start_date'),
      endDate: t('Global.Label.end_date'),
      isActive: t('Global.Label.status'),
    }),
    [t]
  );

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        product: yup
          .mixed<Product>()
          .required(t('Global.Validation.var_required', { var: labels.product })),
        unit: yup
          .mixed<ProductUnitOfMeasure>()
          .required(t('Global.Validation.var_required', { var: labels.unit })),
        discountType: yup
          .string()
          .oneOf([DiscountType.PERCENTAGE, DiscountType.FIXED])
          .required(t('Global.Validation.var_required', { var: labels.product })),
        discountAmount: yup
          .number()
          .typeError(t('Global.Validation.var_required', { var: labels.discountAmount }))
          .min(1, t('Global.Validation.var_min', { var: labels.discountAmount, min: 1 }))
          .test(
            'max-discount',
            t('Global.Validation.var_invalid', { var: labels.discountAmount }),
            function (value) {
              const { discountType, unit } = this.parent;
              if (!value) return false;
              if (discountType === DiscountType.PERCENTAGE) return value < 100;
              return value < (unit?.price || 0);
            }
          )
          .required(t('Global.Validation.var_required', { var: labels.discountAmount })),
        startDate: yup
          .date()
          .required(t('Global.Validation.var_required', { var: labels.startDate })),
        endDate: yup
          .date()
          .required(t('Global.Validation.var_required', { var: labels.endDate }))
          .min(
            yup.ref('startDate'),
            t('Global.Validation.var1_before_var2', {
              var1: labels.startDate,
              var2: labels.endDate,
            })
          ),
        is_active: yup
          .boolean()
          .required(t('Global.Validation.var_required', { var: labels.isActive })),
      })
    ),
    defaultValues: {
      product: offer
        ? {
            id: '',
            nameAr: offer.productUnitOfMeasure.productNameAr,
            nameEn: offer.productUnitOfMeasure.productNameEn,
          }
        : (null as unknown as Record<'id' | 'nameAr' | 'nameEn', string>),
      unit: offer
        ? {
            id:offer.productUnitOfMeasure.id,
            unitOfMeasureNameAr: offer.productUnitOfMeasure.unitOfMeasureNameAr,
            unitOfMeasureNameEn: offer.productUnitOfMeasure.unitOfMeasureNameEn,
            price: offer.productUnitOfMeasure.price,
          }
        : (null as unknown as Record<'id' | 'nameAr' | 'nameEn', string>),
      discountType: offer?.discountType || DiscountType.PERCENTAGE,
      discountAmount: offer
        ? offer.discountType === DiscountType.PERCENTAGE
          ? offer.discount * 100
          : offer.discount
        : 0,
      startDate: offer ? new Date(offer.startDate) : (undefined as unknown as Date),
      endDate: offer ? new Date(offer.endDate) : (undefined as unknown as Date),
      is_active: offer?.isActive || false,
    },
  });
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [selectedProduct, selectedUnit, discountType, discountAmount] = watch([
    'product',
    'unit',
    'discountType',
    'discountAmount',
  ]);

  const handleFormSubmit = handleSubmit(async (data) => {
    const {
      product: _,
      unit,
      discountAmount,
      is_active,
      startDate,
      endDate,
      ...rest
    } = data;

    const dataBody = {
      productUnitOfMeasureId: unit.id,
      discount:
        data.discountType === DiscountType.PERCENTAGE ? discountAmount / 100 : discountAmount,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: is_active,
      ...rest,
    };
    try {
      if (offer) {
        const res = await editData(endpoints.offers.patch(offer.id), 'PATCH', dataBody);
        if ('error' in res) {
           throw new Error(res.error);
        }
        enqueueSnackbar(t('Global.Server.Success.var_updated', { var: t('Pages.Offers.offer') }));
       invalidateTag(FetchTags.OffersList);
      } else {
        const res = await postData(endpoints.offers.post, dataBody);
        if ('error' in res) {
          throw new Error(res.error);
        }
        enqueueSnackbar(t('Global.Server.Success.var_created', { var: t('Pages.Offers.offer') }));
        invalidateTag(FetchTags.OffersList);
      }
      invalidateTag(FetchTags.OffersList);
      router.push(paths.controlPanel.marketings.offers.list);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  useEffect(() => {
    if (!selectedProduct) {
      setValue('unit', {
        unitOfMeasureNameAr: '',
        unitOfMeasureNameEn: '',
      } as ProductUnitOfMeasure);
    }
  }, [selectedProduct, setValue]);

  const newPrice = useMemo(() => {
    if (!selectedUnit?.price || !discountAmount) return 0;

    const value =
      discountType === DiscountType.PERCENTAGE
        ? selectedUnit.price * (1 - discountAmount / 100)
        : selectedUnit.price - discountAmount;
    return value.toFixed(2);
  }, [selectedUnit?.price, discountType, discountAmount]);

  // Add this effect to fetch product details
  useEffect(() => {
    if (offer) return;
    const fetchProductDetails = async () => {
      if (selectedProduct?.id) {
        const response = await getData<ProductDetails>(
          endpoints.product.single(selectedProduct.id)
        );
        if (!('error' in response)) {
          setSelectedProductDetails(response.data);
        }
      } else {
        setSelectedProductDetails(null);
      }
    };

    fetchProductDetails();
  }, [offer, selectedProduct?.id]);

  return (
    <FormProvider methods={methods}>
      <Card sx={{ p: 3 }}>
        <Grid2 container columnSpacing={3} rowSpacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Stack spacing={2}>
              <RHFAutocomplete
                name="product"
                label={labels.product}
                options={products}
                disabled={!!offer}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option[nameValue]
                }
                color="primary"
              />
                <RHFAutocomplete
                  name="discountType"
                  label={labels.discountType}
                  options={[DiscountType.PERCENTAGE, DiscountType.FIXED]}
                  getOptionLabel={(option) =>
                    option === DiscountType.PERCENTAGE
                    ? t('Global.Label.percentage')
                    : t('Global.Label.fixed')
                  }
                  color="primary"
                />
              <RHFTextField
                name="unit_price"
                label={labels.unit_price}
                value={selectedUnit?.price || 0}
                disabled
                color="primary"
              />
                <RHFDatePicker
                  name="startDate"
                  label={labels.startDate}
                  slotProps={{ textField: { fullWidth: true, color: 'primary' } }}
                />
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Stack spacing={2}>
              <RHFAutocomplete
                name="unit"
                label={labels.unit}
                options={selectedProductDetails?.productUnitOfMeasures || []}
                disabled={!selectedProductDetails || !!offer}
                getOptionLabel={(option) =>
                  typeof option === 'string'
                  ? option
                  : option[nameValue === 'nameAr' ? 'unitOfMeasureNameAr' : 'unitOfMeasureNameEn']
                }
                color="primary"
              />
              <RHFTextField
                name="discountAmount"
                label={labels.discountAmount}
                type="number"
                color="primary"
              />
                <RHFTextField
                  name="newPrice"
                  label={labels.newPrice}
                  value={newPrice}
                  disabled
                  color="primary"
                />
              <RHFDatePicker
                name="endDate"
                label={labels.endDate}
                slotProps={{ textField: { fullWidth: true, color: 'primary' } }}
              />
              <RHFSwitch name="is_active" label={labels.isActive} />
            </Stack>
          </Grid2>
        </Grid2>

        <Stack direction="row" spacing={1} mt={3} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => router.replace(paths.controlPanel.marketings.offers.list)}
          >
            {t('Global.Action.cancel')}
          </Button>
          <LoadingButton variant="contained" loading={isSubmitting} onClick={handleFormSubmit}>
            {t('Global.Action.save')}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
