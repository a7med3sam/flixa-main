'use client';

import { m } from 'framer-motion';
import Button from '@mui/material/Button';
import { useTranslations } from 'next-intl';
import CompactLayout from 'src/layouts/compact';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { ForbiddenIllustration } from 'src/assets/illustrations';
import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function View403() {
  const t = useTranslations('Pages.Error403');

  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {t('title')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {t('message1')}
            <br />
            {t('message2')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          {t('button')}
        </Button>
      </MotionContainer>
    </CompactLayout>
  );
}
