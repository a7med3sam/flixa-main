'use client';
import { m } from 'framer-motion';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import { useAuthStore } from 'src/auth/auth-store';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Stack, alpha, Avatar, Button, Divider, IconButton, Typography } from '@mui/material';

export default function AccountPopover() {
  const t = useTranslations('');
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const popover = usePopover();

  const handleLogout = async () => {
    await logout();
  };

  const handleEdit = () => {
    popover.onClose();
    router.push(paths.controlPanel.profile.viewProfileEdit);
  };

  return (
    <>
      <Button
  onClick={popover.onOpen}
  sx={{
    px: 1,
    py: 0.5,
    borderRadius: '20px',
    bgcolor: 'background.paper',
    color: 'text.primary',
    textTransform: 'none',
    gap: 1,
    boxShadow: (theme) => `inset 0 0 12px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      bgcolor: 'background.paper',
      boxShadow: (theme) => `inset 0 0 16px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
      transform: 'translateY(-1px)',
    }
  }}
>
  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
    Admin
  </Typography>

  <Avatar
    src={"/3d.png"}
    alt={user?.name}
    sx={{ width: 32, height: 32 }}
  >
    {/* {user?.name?.charAt(0).toUpperCase()} */}
  </Avatar>

  
</Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          width: 250,
          p: 3,
          borderRadius: 3,
          boxShadow: (theme) => `0 8px 24px -4px ${alpha(theme.palette.grey[900], 0.1)}, inset 0 0 16px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
          textAlign: 'center',
        }}
      >
        <Stack alignItems="center" spacing={1}>
          <Avatar src={"/3d.png"} alt={user?.name} sx={{ width: 80, height: 80 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="subtitle1" noWrap>
            {user?.name || 'No Name'}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email || 'test@flixa.com'}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          {/* <Button
            fullWidth
            variant="outlined"
            color="success"
            onClick={handleEdit}
            startIcon={<Iconify icon="eva:edit-2-fill" />}
            sx={{ justifyContent: 'center', fontWeight: 600 }}
          >
            {t('Pages.Notification.status.account_update')}
          </Button> */}

          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<Iconify icon="solar:logout-2-bold-duotone" />}
            sx={{ justifyContent: 'center', fontWeight: 600 }}
          >
            {t('Pages.Notification.status.logout')}
          </Button>
        </Stack>
      </CustomPopover>
    </>
  );
}
