'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { paths } from 'src/routes/paths';
import { ICONS } from 'src/config-icons';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'notistack';
import { useAuthStore } from 'src/auth/auth-store';

import { EMAIL_REGEX } from './config-auth';

export default function LoginView() {
  const t = useTranslations();

  const LABELS = {
    email: t('Global.Label.email'),
    password: t('Global.Label.password'),
  };

  const router = useRouter();

  const showPassword = useBoolean();

  const methods = useForm({
    defaultValues: {
      email: 'admin@flexa.com',
      password: 'Secret@1234',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { enqueueSnackbar } = useSnackbar();
  const login = useAuthStore((state) => state.login);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      await login({ email: data.email, password: data.password });
      router.push(PATH_AFTER_LOGIN);
      enqueueSnackbar(t('Pages.Messages.login_success') || 'Login successful', { variant: 'success' });
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error?.message || t('Pages.Messages.login_failed') || 'Login failed', {
        variant: 'error',
      });
    }
  });

  const renderHead = (
    <Typography variant="h3" textTransform="capitalize" textAlign="start" color="primary.main">
      {t('Global.Label.Welcome')} 👋
    </Typography>
  );

  const renderForm = (
    <Stack spacing={5} sx={{ minWidth: '100%' }}>
      {renderHead}

      <RHFTextField
        name="email"
        label={LABELS.email}
        variant="filled"
        color="primary"
        formLabelProps={{
          sx: {
            px: 1,
            borderRadius: 1,
            fontSize: 14,
          },
        }}
        inputProps={{
          sx: {
            bgcolor: '#F8F8F8',
            px: 1,
            borderRadius: 1,
            fontSize: 14,
          },
        }}
      />

      <Box>
        <RHFTextField
          name="password"
          label={LABELS.password}
          type={showPassword.value ? 'text' : 'password'}
          variant="filled"
          color="primary"
          slotProps={{
            input: {
              sx: {
                bgcolor: '#F8F8F8',
                borderRadius: 1,
                fontSize: 14,
                pr: 1,

                '&:hover': {
                  bgcolor: '#F8F8F8',
                },

                '&.Mui-focused': {
                  bgcolor: '#F8F8F8',
                },

                '&:before': {
                  borderBottom: 'none',
                },

                '&:hover:not(.Mui-disabled, .Mui-error):before': {
                  borderBottom: 'none',
                },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    {showPassword.value ? ICONS.global.eyeClosed : ICONS.global.eye}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          formLabelProps={{
            sx: {
              color: 'text.secondary',
              px: 1,
              borderRadius: 1,
              fontSize: 14,
            },
          }}
          inputProps={{
            sx: {
              px: 1,
            },
          }}
        />
        <Link
          href={paths.auth.forgotPassword}
          component={RouterLink}
          color="primary.main"
          variant="caption"
          paddingInlineStart={2}
          display="inline-block"
        >
          {t('Pages.Auth.forgot_password')}
        </Link>
      </Box>

      <LoadingButton
        fullWidth
        color="primary"
        size="medium"
        type="submit"
        variant="soft"
        loading={isSubmitting}
        sx={{ mt: -1, color: 'common.white', fontWeight: 500, fontSize: 16, py: 1.5 }}
      >
        {t('Pages.Auth.login_submit')}
      </LoadingButton>
    </Stack>
  );

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '440px',
        marginInline: 'auto',
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </Box>
  );
}
