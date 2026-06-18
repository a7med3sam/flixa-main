'use client';

import Box from '@mui/material/Box';
import Logo from 'src/components/logo';
import Stack from '@mui/material/Stack';
import { hideScroll } from 'src/theme/css';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { NavSectionMini } from 'src/components/nav-section';
import { alpha } from '@mui/material/styles';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <Box
      sx={{
        bgcolor: '#FAFBFC',
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          insetInlineStart: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: `1px solid ${alpha('#919EAB', 0.16)}`,
          ...hideScroll.x,
          minHeight: '100%',
          bgcolor: '#D5DAE3',
        }}
      >
        <Box width={50} mx={'auto'}>
          <Logo sx={{ my: 2, maxWidth: '100%', color: '#212B36' }} />
        </Box>

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
      </Stack>
    </Box>
  );
}
