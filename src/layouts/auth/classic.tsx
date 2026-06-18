import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCurrentLocale } from 'src/utils/locale-utils';
// ----------------------------------------------------------------------

const BG_CLIP_START = '10vw';

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const mdUp = useResponsive('up', 'md');
  const { dir } = useCurrentLocale();

  const renderContent = (
    <Stack
      justifyContent="center"
      sx={{
        width: { xs: '100%', lg: `calc(50vh + ${BG_CLIP_START})` },
        px: { xs: 2, sm: 10, md: `calc(${BG_CLIP_START} / 2)` },
        pt: { xs: 15, md: 0 },
        pb: { xs: 15, md: 0 },
        position: 'relative',
        isolation: 'isolate',
        '&::before': {
          content: '""',
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'primary.main',
          clipPath: { lg: `circle(50vh at ${BG_CLIP_START} 50%)` },
          ...(dir === 'rtl' ? { transform: 'scaleX(-1)' } : undefined),
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          zIndex: -1,
          top: 0,
          insetInlineStart: 0,
          width: BG_CLIP_START,
          height: '100%',
          bgcolor: 'primary.main',
        },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack flexGrow={1} spacing={10} alignItems="center" justifyContent="center" paddingInline={2}>
      {title && (
        <Typography variant="h3" color="primary" sx={{ maxWidth: 480, textAlign: 'center' }}>
          {title}
        </Typography>
      )}

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/illustration_dashboard.png'}
        sx={{
          maxWidth: {
            xs: 480,
            lg: 560,
            xl: 720,
          },
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row-reverse"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.neutral',
      }}
    >
      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}
