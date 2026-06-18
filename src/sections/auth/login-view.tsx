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

import { EMAIL_REGEX } from './config-auth';

export default function LoginView() {
  const t = useTranslations();

  const LABELS = {
    email: t('Global.Label.email'),
    password: t('Global.Label.password'),
  };

  const router = useRouter();

  const showPassword = useBoolean();

  const methods = useForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    router.push(PATH_AFTER_LOGIN);
  });

  const renderHead = (
    <Typography
      variant="h3"
      textTransform="capitalize"
      textAlign="center"
      color="primary.contrastText"
    >
      {t('Pages.Auth.login_title')}
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
            color: 'white',
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
              color: 'white',
            },
          }}
        />
        <Link
          href={paths.auth.forgotPassword}
          component={RouterLink}
          color="primary.light"
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
        size="large"
        type="submit"
        variant="soft"
        loading={isSubmitting}
        sx={{ mt: -1 }}
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
