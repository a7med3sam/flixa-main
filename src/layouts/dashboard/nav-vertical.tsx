'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Logo from 'src/components/logo';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { usePathname } from 'src/routes/hooks';
import Scrollbar from 'src/components/scrollbar';
import { useAuthStore } from 'src/auth/auth-store';
import { useResponsive } from 'src/hooks/use-responsive';
import { NavSectionVertical } from 'src/components/nav-section';
import { alpha } from '@mui/material/styles';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useAuthStore();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Stack
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#D5DAE3',
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${alpha('#919EAB', 0.2)}`,
        }}
      >
        <Logo
          enableText
          sx={{ width: 130, height: 44, color: '#212B36' }}
          textProps={{
            sx: { color: '#212B36' },
            variant: 'h5',
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        />
      </Box>

      <Scrollbar
        sx={{
          flex: 1,
          py: 1,
          '& .simplebar-content': {
            height: 1,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <NavSectionVertical
          data={navData}
          slotProps={{
            userModules: user?.modules,
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
      </Scrollbar>

      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: `1px solid ${alpha('#919EAB', 0.2)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1,
            width: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#22C55E',
            }}
          />
          <Box
            component="span"
            sx={{
              color: alpha('#212B36', 0.5),
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: 0.3,
            }}
          >
            فليكسا
          </Box>
        </Box>
      </Box>
    </Stack>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
              bgcolor: '#D5DAE3',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
