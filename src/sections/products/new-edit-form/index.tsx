'use client';

import * as yup from 'yup';
import { useEffect } from 'react';
import { toFormData } from 'axios';
import { Unit } from 'src/types/units';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { endpoints } from 'src/utils/endpoints';
import { Category } from 'src/types/categories';
import { ProductDetails } from 'src/types/products';
import { useQuery } from 'src/components/use-query';
import FormProvider from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FetchTags } from 'src/actions/config-actions';
import { postData, editData } from 'src/utils/crud-fetch-api';
import { invalidateTag } from 'src/actions/cache-invalidation';

import { useFormStore } from './form-store';
import { convertIntoEditFormData } from './form-utils';

interface Props {
  product?: ProductDetails;
  categories: Category[];
  subCategories: Category[];
  units: Unit[];
  children: React.ReactNode;
}
export default function NewEditProductForm({
  product,
  categories,
  subCategories,
  units,
  children,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { setAll, labels, setSubCategories } = useFormStore();
  const { values } = useQuery(['mainCategoryId']);

  useEffect(() => {
    setAll({
      product,
      categories,
      subCategories,
      units,
      labels: {
        NameAr: t('Global.Label.name_ar'),
        NameEn: t('Global.Label.name_en'),
        Barcode: t('Global.Label.barcode'),
        DescriptionAr: t('Global.Label.description_ar'),
        DescriptionEn: t('Global.Label.description_en'),
        Category: t('Global.Label.category'),
        SubCategory: t('Global.Label.subcategory'),
        MainUnit: t('Global.Label.main_unit'),
        SubUnit: t('Global.Label.sub_unit'),
        ConversionRate: t('Global.Label.conversion_rate'),
        Price: t('Global.Label.price'),
        StockQuantity: t('Global.Label.quantity'),
        IsActive: t('Global.Label.status'),
        Images: t('Global.Label.images'),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSubCategories(subCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategories]);

  const schema = yup.object().shape({
    NameAr: yup.string().required(t('Global.Validation.var_required', { var: labels.NameAr })),
    NameEn: yup.string().required(t('Global.Validation.var_required', { var: labels.NameEn })),
    Barcode: yup
      .string()
      .required(t('Global.Validation.var_required', { var: labels.Barcode }))
      .min(10, t('Global.Validation.var_length', { var: labels.Barcode, length: 10 }))
      .max(22, t('Global.Validation.var_length', { var: labels.Barcode, length: 22 })),
    DescriptionAr: yup
      .string()
      .required(t('Global.Validation.var_required', { var: labels.DescriptionAr })),
    DescriptionEn: yup
      .string()
      .required(t('Global.Validation.var_required', { var: labels.DescriptionEn })),
    mainCategory: yup
      .object()
      .shape({
        id: yup.string(),
      })
      .nullable(),
    Category: yup
      .object()
      .shape({
        id: yup.string().required(),
      })
      .nullable()
      .required(t('Global.Validation.var_required', { var: labels.Category })),
    StockQuantity: yup
      .number()
      .required(t('Global.Validation.var_required', { var: labels.StockQuantity }))
      .min(1, t('Global.Validation.var_min', { var: labels.StockQuantity, min: 1 })),
    IsActive: yup.boolean().required(),
    Images: yup
      .array(
        yup
          .mixed<File | string>()
          .required(t('Global.Validation.var_required', { var: labels.Images }))
      )
      .required(t('Global.Validation.var_required', { var: labels.Images }))
      .min(1, t('Global.Validation.var_required', { var: labels.Images })),
    MainUnit: yup
      .object()
      .shape({
        id: yup.string(),
      })
      .nullable()
      .required(t('Global.Validation.var_required', { var: labels.MainUnit })),
    PriceInMainUnit: yup
      .number()
      .required(t('Global.Validation.var_required', { var: labels.Price }))
      .min(1, t('Global.Validation.var_min', { var: labels.Price, min: 1 })),
    ProductUnitOfMeasures: yup
      .array(
        yup.object().shape({
          originalId: yup.string(),
          id: yup.string(),
          UnitId: yup
            .string()
            .required(t('Global.Validation.var_required', { var: labels.SubUnit })),
          Price: yup
            .number()
            .required(t('Global.Validation.var_required', { var: labels.Price }))
            .min(1, t('Global.Validation.var_min', { var: labels.Price, min: 1 })),
          ConversionRate: yup
            .number()
            .min(0.01, t('Global.Validation.var_min', { var: labels.ConversionRate, min: 0.01 }))
            .required(t('Global.Validation.var_required', { var: labels.ConversionRate })),
        })
      )
      .required(t('Global.Validation.var_required', { var: labels.ProductUnitOfMeasures })),
  });
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      NameAr: product?.nameAr || '',
      NameEn: product?.nameEn || '',
      Barcode: product?.barcode || '',
      DescriptionAr: product?.descriptionAr || '',
      DescriptionEn: product?.descriptionEn || '',
      mainCategory:
        categories.find((item) => item.id === values.mainCategoryId) ||
        categories.find((item) => item.id === product?.category?.parentCategory?.id) ||
        null,
      Category: (product?.category || null) as any,
      StockQuantity: product?.stockQuantity || 0,
      IsActive: product?.isActive || false,
      Images: product?.productImages.map(({ url }) => url) || [],
      MainUnit: (units.find((item) => item.id === product?.mainUnitId) || null) as any,
      PriceInMainUnit:
        product?.productUnitOfMeasures.find((item) => item.unitOfMeasureId === product.mainUnitId)
          ?.price || 0,
      ProductUnitOfMeasures:
        product?.productUnitOfMeasures
          .filter(({ unitOfMeasureId }) => unitOfMeasureId !== product?.mainUnitId)
          .map(({ id, unitOfMeasureId, price, conversionRate }) => ({
            originalId: id,
            UnitId: unitOfMeasureId,
            Price: price,
            ConversionRate: conversionRate,
          })) || [],
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (product?.id) {
        const formData = convertIntoEditFormData(data, product);
        res = await editData(
          `${endpoints.product.patch(product.id)}?${new URLSearchParams().toString()}`,
          'PATCH',
          formData
        );
      } else {
        const {
          Category,
          MainUnit,
          Images,
          ProductUnitOfMeasures,
          mainCategory: _,
          PriceInMainUnit,
          ...rest
        } = data;

        if (!Category?.id) {
          enqueueSnackbar(t('Global.Validation.var_required', { var: labels.Category }), {
            variant: 'error',
          });
          return;
        }

        if (!MainUnit?.id) {
          enqueueSnackbar(t('Global.Validation.var_required', { var: labels.MainUnit }), {
            variant: 'error',
          });
          return;
        }

        const cleanedUnits = ProductUnitOfMeasures.map(
          ({ originalId: _oid, id: _uid, ...unit }) => unit
        );

        const dataBody = {
          ...rest,
          CategoryId: Category.id,
          MainUnitId: MainUnit.id,
          ConversionRateInMainUnit: 1,
          PriceInMainUnit,
          ProductUnitOfMeasures: cleanedUnits,
        };

        // eslint-disable-next-line no-console
        console.log('[CreateProduct] Submitting:', JSON.stringify(dataBody, null, 2));

        const formData = new FormData();
        toFormData(dataBody, formData);
        Images.forEach((item: File | string) => formData.append('Images', item));

        res = await postData(endpoints.product.create, formData);

        // eslint-disable-next-line no-console
        console.log('[CreateProduct] Response:', res);
      }

      if ('error' in res) {
        enqueueSnackbar(res.error, { variant: 'error' });
      } else {
        enqueueSnackbar(
          product
            ? t('Global.Server.Success.var_updated', { var: t('Global.Label.product') })
            : t('Global.Server.Success.var_created', { var: t('Global.Label.product') }),
          { variant: 'success' }
        );
        invalidateTag(FetchTags.ProductsList);
        router.push(paths.controlPanel.products.list);
      }
    } catch (ignoreError) {
      enqueueSnackbar(t('Global.Server.Error.internal_server_error'), { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {children}
    </FormProvider>
  );
}
