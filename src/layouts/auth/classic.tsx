'use client';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useResponsive } from 'src/hooks/use-responsive';
// ----------------------------------------------------------------------

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image }: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      justifyContent="center"
      sx={{
        width: { xs: '100%', md: '33.333%' },
        height: '100%',
        minHeight: 0,
        px: { xs: 3, sm: 8, md: 5, lg: 7 },
        py: { xs: 4, md: 0 },
        bgcolor: 'common.white',
        overflow: 'hidden',
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      spacing={8}
      alignItems="center"
      justifyContent="center"
      sx={{
        // width: '66.667%',
        height: '100%',
        minHeight: 0,
        // px: 6,
        bgcolor: 'background.neutral',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/illustration_dashboard.png'}
        sx={{
          width: '100%',
          maxWidth: { md: 690, lg: 720, xl: 860 },
          height: 'auto',
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        height: '100dvh',
        bgcolor: 'common.white',
        overflow: 'hidden',
      }}
    >
      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}
