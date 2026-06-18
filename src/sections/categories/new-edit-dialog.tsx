'use client';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { endpoints } from 'src/utils/endpoints';
import { Category } from 'src/types/categories';
import { yupResolver } from '@hookform/resolvers/yup';
import { FetchTags } from 'src/actions/config-actions';
import { useCurrentLocale } from 'src/utils/locale-utils';
import RHFSwitch from 'src/components/hook-form/rhf-switch';
import { editData, postData } from 'src/utils/crud-fetch-api';
import { invalidateTag } from 'src/actions/cache-invalidation';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';
import RHFAutocomplete from 'src/components/hook-form/rhf-autocomplete';
import { Grid2, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category;
  parents?: Category[];
  staticParent?: Category;
}

export default function NewEditCategoryDialog({
  open,
  onClose,
  category,
  parents,
  staticParent,
}: Props) {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const isSubCategory = !!parents || !!staticParent;
  const { value: locale } = useCurrentLocale();

  const title = useMemo(() => {
    switch (true) {
      case !isSubCategory && !category:
        return t('Pages.Categories.add_category_title');
      case isSubCategory && !category:
        return t('Pages.Categories.add_subcategory_title');
      case !isSubCategory && !!category:
        return t('Pages.Categories.edit_category_title');
      case isSubCategory && !!category:
        return t('Pages.Categories.edit_subcategory_title');
      default:
        return '';
    }
  }, [isSubCategory, category, t]);

  const labels = useMemo(
    () => ({
      NameAr: t('Global.Label.name_ar'),
      NameEn: t('Global.Label.name_en'),
      IsActive: t('Global.Label.status'),
      Order: t('Global.Label.order'),
      ImageUrl: t('Global.Label.image'),
      mainCategory: t('Global.Label.category'),
    }),
    [t]
  );

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        NameAr: yup.string().required(t('Global.Validation.var_required', { var: labels.NameAr })),
        NameEn: yup.string().required(t('Global.Validation.var_required', { var: labels.NameEn })),
        IsActive: yup
          .boolean()
          .required(t('Global.Validation.var_required', { var: labels.IsActive })),
        Order: yup
          .number()
          .typeError(t('Global.Validation.var_required', { var: labels.Order }))
          .min(0, t('Global.Validation.var_min', { var: labels.Order, min: 0 }))
          .required(t('Global.Validation.var_required', { var: labels.Order })),
        ImageUrl: yup
          .mixed<File | string>()
          .required(t('Global.Validation.var_required', { var: labels.ImageUrl })),
        ParentCategory: isSubCategory
          ? yup
              .mixed<Category>()
              .required(t('Global.Validation.var_required', { var: labels.mainCategory }))
          : yup.mixed<Category>(),
      })
    ),
    defaultValues: {
      NameAr: category?.nameAr || '',
      NameEn: category?.nameEn || '',
      IsActive: category?.isActive || false,
      Order: category?.order || 1,
      ImageUrl: category?.imageUrl || undefined,
      ParentCategory: staticParent || category?.parentCategory || undefined,
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { ImageUrl, ParentCategory, ...rest } = data;
  
    const formData = new FormData();
  
    formData.append('NameAr', rest.NameAr);
    formData.append('NameEn', rest.NameEn);
    formData.append('IsActive', rest.IsActive ? 'true' : 'false');
    formData.append('Order', rest.Order.toString());
  
    if (isSubCategory && ParentCategory?.id) {
      formData.append('ParentCategoryId', ParentCategory.id);
    }
  
    if (typeof ImageUrl !== 'string') {
      formData.append('ImageUrl', ImageUrl);
    }
  
    let res;
    if (category) {
      res = await editData(
        `${endpoints.categories.patch(category.id)}`,
        'PATCH',  
        formData
      );
    } else {

      res = await postData(`${endpoints.categories.create}`, formData);

    }
  
    if ('error' in res) {
      if(res.status === 403) 
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        category
          ? t('Global.Server.Success.var_updated', {
              var: t(`Global.Label.${isSubCategory ? 'subcategory' : 'category'}`),
            })
          : t('Global.Server.Success.var_created', {
              var: t(`Global.Label.${isSubCategory ? 'subcategory' : 'category'}`),
            })
      );
      invalidateTag(FetchTags.CategoriesList);
      onClose();
    }
  });
  
  useEffect(() => {
    if (open) reset();
    if (open && category) {
      setValue('NameAr', category.nameAr);
      setValue('NameEn', category.nameEn);
      setValue('IsActive', category.isActive);
      setValue('Order', category.order);
      setValue('ImageUrl', category.imageUrl);
      setValue('ParentCategory', category.parentCategory || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods}>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <RHFUploadAvatar
                name="ImageUrl"
                label={labels.ImageUrl}
                sx={{ marginInlineStart: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <RHFTextField
                name="NameAr"
                label={labels.NameAr}
                placeholder={labels.NameAr}
                color="primary"
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <RHFTextField
                name="NameEn"
                label={labels.NameEn}
                placeholder={labels.NameEn}
                color="primary"
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <RHFSwitch name="IsActive" label={labels.IsActive} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <RHFTextField
                name="Order"
                label={labels.Order}
                placeholder={labels.Order}
                color="primary"
                fullWidth
              />
            </Grid2>
            {isSubCategory && (
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <RHFAutocomplete
                  name="ParentCategory"
                  label={labels.mainCategory}
                  placeholder={labels.mainCategory}
                  fullWidth
                  options={staticParent ? [staticParent] : parents || []}
                  color="primary"
                  getOptionLabel={(option) =>
                    typeof option === 'string'
                      ? option
                      : option[locale === 'ar' ? 'nameAr' : 'nameEn'] || ''
                  }
                  disabled={!!staticParent}
                />
              </Grid2>
            )}
          </Grid2>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('Global.Action.cancel')}
        </Button>
        <LoadingButton variant="contained" onClick={onSubmit} loading={isSubmitting}>
          {t('Global.Action.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
