import { bgBlur } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCurrentLocale } from 'src/utils/locale-utils';
import { useSettingsContext } from 'src/components/settings';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

import { NAV } from '../config-layout';

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }: IconButtonProps) {
  const theme = useTheme();

  const { dir } = useCurrentLocale();

  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  if (!lgUp) {
    return null;
  }

  return (
    <IconButton
      size="small"
      onClick={() =>
        settings.onUpdate('themeLayout', settings.themeLayout === 'vertical' ? 'mini' : 'vertical')
      }
      sx={{
        p: 0.5,
        top: 32,
        position: 'fixed',
        insetInlineStart: NAV.W_VERTICAL - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={16}
        sx={{ transform: dir === 'rtl' ? 'scale(-1, 1)' : 'scale(1, 1)' }}
        icon={
          settings.themeLayout === 'vertical'
            ? 'eva:arrow-ios-back-fill'
            : 'eva:arrow-ios-forward-fill'
        }
      />
    </IconButton>
  );
}
