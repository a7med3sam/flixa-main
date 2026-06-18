'use client';
import { enqueueSnackbar } from 'notistack';
import { useTranslations } from 'next-intl';
import { endpoints } from 'src/utils/endpoints';
import { editData } from 'src/utils/crud-fetch-api';
import React, { useState, useCallback } from 'react';
import { StaticPage } from 'src/types/static-page-type';
import { useCurrentLocale } from 'src/utils/locale-utils';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Box, Card, Stack, Button, Container, TextField, Typography } from '@mui/material';

interface Props {
  type: string;
  data?: StaticPage;
}

export default function PolicyView({ type, data }: Props) {
  const t = useTranslations('');
  const isPrivacy = type === 'PrivacyPolicy';
  const titleAr = isPrivacy ? t('Pages.PrivacyPolicy.title') : t('Pages.ReturnPolicy.title');
  const { value: locale } = useCurrentLocale();
  const [contentAr, setContentAr] = useState(data?.contentAr || '');
  const [contentEn, setContentEn] = useState(data?.contentEn || '');
  const [isChanged, setIsChanged] = useState(false);

  const handleContentArChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentAr(e.target.value);
    checkChanges(e.target.value, contentEn);
  };

  const handleContentEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentEn(e.target.value);
    checkChanges(contentAr, e.target.value);
  };

  const checkChanges = (newAr: string, newEn: string) => {
    const arChanged = newAr !== data?.contentAr;
    const enChanged = newEn !== data?.contentEn;
    setIsChanged(arChanged || enChanged);
  };

  const updateStaticPolicy = useCallback(async () => {
    const payload = {
      titleAr: 'TitleAr',
      titleEn: 'TitleEn',
      contentAr,
      contentEn,
    };
    const res = await editData(endpoints.staticPages.patch(type), 'PATCH', payload);
    if ('error' in res) {
      enqueueSnackbar(res.error || t('Global.Server.Error.failed_to_update'), {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar(
      t('Global.Server.Success.var_updated', {
        var: isPrivacy ? t('Pages.PrivacyPolicy.title') : t('Pages.ReturnPolicy.title'),
      }),
      { variant: 'success' }
    );

    setIsChanged(false);
  }, [contentAr, contentEn, type, isPrivacy, t]);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs heading={titleAr} links={[]} />
      <Card sx={{ p: 1.5 }}>
        <Stack spacing={1}>
          {/* Arabic Content - Right Aligned */}
            <Typography variant="subtitle1"  align={`${locale === 'ar' ? 'right' : 'left'}`} fontWeight="bold" gutterBottom>
              {t('Pages.ReturnPolicy.content_ar')}
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={6}
              value={contentAr}
              onChange={handleContentArChange}
              placeholder={t('Pages.ReturnPolicy.content_ar')}
              sx={{
                bgcolor: '#edf1ec',
                borderRadius: 1,
                textAlign: 'right',
                direction: `${locale === 'en' ? 'rtl' : 'ltr'}`,
              }}
            />

          {/* English Content - Left Aligned */}
            <Typography variant="subtitle1" align={`${locale === 'ar' ? 'right' : 'left'}`} fontWeight="bold" gutterBottom>
              {t('Pages.ReturnPolicy.content_en')}
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={6}
              value={contentEn}
              onChange={handleContentEnChange}
              placeholder={t('Pages.ReturnPolicy.content_en')}
              sx={{
                bgcolor: '#edf1ec',
                borderRadius: 1,
                textAlign: 'left',
                direction: `${locale === 'ar' ? 'rtl' : 'ltr'}`,
              }}
            />

          {isChanged && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={updateStaticPolicy} sx={{ mt: 2 }}>
                {t('Global.Action.edit')}
              </Button>
            </Box>
          )}
        </Stack>
      </Card>
    </Container>
  );
}