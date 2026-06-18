'use client';

import { m } from 'framer-motion';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import CompactLayout from 'src/layouts/compact';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { SeverErrorIllustration } from 'src/assets/illustrations';
import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function Page500({ error }: { error?: string }) {
  const t = useTranslations('Pages.Error500');

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) enqueueSnackbar(error, { variant: 'error' });
  }, [enqueueSnackbar, error]);

  return (
    <CompactLayout>
      <Container sx={{ textAlign: 'center', paddingTop: 5 }}>
        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {t('title')}
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>{t('message')}</Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>

          <Button component={RouterLink} href="/" size="large" variant="contained">
            {t('button')}
          </Button>
        </MotionContainer>
      </Container>
    </CompactLayout>
  );
}
