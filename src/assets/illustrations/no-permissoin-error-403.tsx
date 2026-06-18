import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

import BackgroundShape from './background-shape';

function UnauthorizedIllustration({ ...other }: BoxProps) {
  const t = useTranslations();
  const theme = useTheme();
  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <BackgroundShape />

      <image
        href="/assets/illustrations/characters/character_4.png" // optionally change image
        height="300"
        x="205"
        y="30"
      />
      {/* Main "403" text */}
      <text
        x="34%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={120}
        fontWeight={700}
        fill={PRIMARY_DARKER}
      >
        403
      </text>

      {/* "UNAUTHORIZED" text */}
      <text
        x="40%"
        y="80%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={32}
        fill={PRIMARY_DARKER}
      >
        {t('Pages.Error403.title')}{' '}
      </text>
    </Box>
  );
}

export default memo(UnauthorizedIllustration);
