import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
import { RouterLink } from 'src/routes/components';
import { Typography, TypographyProps } from '@mui/material';

import SvgColor from '../svg-color';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  enableText?: boolean;
  textProps?: TypographyProps;
  title?: string;
}

const Logo = ({ disabledLink = false, enableText = false, sx, textProps, title }: LogoProps) => {
  const logo = (
    <Box component="div" sx={{ display: 'flex', width: 'auto', height: 'auto', cursor: 'pointer' }}>
      <SvgColor
        src="/logo/flexa_logo.svg"
        sx={{
          width: 40,
          height: 40,
          cursor: 'pointer',
          // color: 'primary.main',
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
          {title}
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
