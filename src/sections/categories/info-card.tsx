'use client';
import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { ICONS } from 'src/config-icons';
import { useTranslations } from 'next-intl';
import { Category } from 'src/types/categories';
import { RouterLink } from 'src/routes/components';
import ImageLink from 'src/components/image/image-link';
import { useCurrentLocale } from 'src/utils/locale-utils';
import BrokenImage from 'src/components/image/broken-image';
import { Box, Card, Link, Stack, Typography, CardContent } from '@mui/material';

interface Props {
  category: Category;
}

export default function CategoryInfoCard({ category }: Props) {
  const t = useTranslations();
  const { value: locale } = useCurrentLocale();

  const isSubCategory = !!category.parentCategoryId;

  const fields = useMemo(
    () => [
      {
        label: t('Global.Label.name_ar'),
        value: category.nameAr,
      },
      {
        label: t('Global.Label.name_en'),
        value: category.nameEn,
      },
      {
        label: t('Global.Label.order'),
        value: category.order,
      },
      {
        label: t('Global.Label.status'),
        value: category.isActive ? t('Global.Label.active') : t('Global.Label.inactive'),
      },
      ...(isSubCategory
        ? [
            {
              label: t('Global.Label.category'),
              value: (
                <Link
                  href={paths.controlPanel.categories.single(category.parentCategoryId || '')}
                  component={RouterLink}
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                >
                  <span>{category.parentCategory?.[locale === 'ar' ? 'nameAr' : 'nameEn']}</span>
                  <Box component="span" sx={{ fontSize: '.9em', height: '1em' }}>
                    {ICONS.global.externalLink}
                  </Box>
                </Link>
              ),
            },
          ]
        : []),
    ],
    [category, isSubCategory, locale, t]
  );

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-start" spacing={2}>
          <ImageLink href={category.imageUrl}>
            <BrokenImage
              src={category.imageUrl}
              sx={{
                width: '100%',
                maxWidth: 120,
                height: 'auto',
                aspectRatio: 1,
                borderRadius: 1.5,
              }}
            />
          </ImageLink>
          <Stack spacing={1}>
            {fields.map((item) => (
              <Typography key={item.label}>
                <Typography color="primary" fontWeight={700} component="span">
                  {item.label} :
                </Typography>{' '}
                {item.value}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
