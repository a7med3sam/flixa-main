import Link from '@mui/material/Link';
import { useTranslations } from 'next-intl';
import Box, { BoxProps } from '@mui/material/Box';
import { RouterLink } from 'src/routes/components';
import { Typography, TypographyProps } from '@mui/material';

import SvgColor from '../svg-color';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  enableText?: boolean;
  textProps?: TypographyProps;
}

const Logo = ({ disabledLink = false, enableText = false, sx, textProps }: LogoProps) => {
  const t = useTranslations();

  const logo = (
    <Box component="div" sx={{ display: 'flex', width: 'auto', height: 'auto', cursor: 'pointer' }}>
      <SvgColor
        src="/logo/logo_single.svg"
        sx={{
          width: 40,
          height: 40,
          cursor: 'pointer',
          color: 'primary.main',
          ...sx,
        }}
      />
      {enableText && (
        <Typography
          variant="h6"
          component="span"
          textTransform="capitalize"
          alignSelf="center"
          marginInlineStart={-1}
          {...textProps}
        >
          {t('Metadata.title')}
        </Typography>
      )}
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
};

export default Logo;
