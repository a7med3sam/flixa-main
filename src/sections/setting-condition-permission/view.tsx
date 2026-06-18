
import React from 'react';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import { Box, Paper, Stack, Typography } from '@mui/material';

export default function SettingConditionPermission() {
  const t = useTranslations('');

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        bgcolor: 'rgba(244, 67, 54, 0.05)', // خلفية حمراء فاتحة
        textAlign: 'center',
      }}
    >
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'error.main',
            color: '#fff',
          }}
        >
          <Iconify icon="mdi:shield-alert" width={32} height={32} />
        </Box>

        {/* العنوان */}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t('Pages.Setting.PermissionTitle')}
        </Typography>

        {/* الرسالة */}
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', maxWidth: 320, lineHeight: 1.6 }}
        >
          {t('Pages.Setting.PermissionMessage')}
        </Typography>

        {/* رسالة إضافية للتفعيل */}
        <Typography
          variant="caption"
          sx={{ color: 'error.main', fontWeight: 600 }}
        >
          {t('Pages.Setting.PermissionActivate')}
        </Typography>
      </Stack>
      xxx
    </Paper>
  );
}
