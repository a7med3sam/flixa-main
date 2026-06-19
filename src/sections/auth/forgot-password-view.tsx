'use client';

import * as Yup from 'yup';
import Box from '@mui/material/Box';
import YupPassword from 'yup-password';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { ICONS } from 'src/config-icons';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFOTP from 'src/components/hook-form/rhf-otp';
import { memo, useMemo, useState, useEffect } from 'react';
import { Link, IconButton, InputAdornment } from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { EMAIL_REGEX } from './config-auth';

YupPassword(Yup);

type StepProps = {
  onNextStep: VoidFunction;
  onBackStep: VoidFunction;
};

type OtpFormValues = {
  otp: string;
};

type PasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export default function ForgotPasswordView() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [, setToken] = useState('');

  const handleBackStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '440px',
        marginInline: 'auto',
      }}
    >
      {step === 1 && (
        <EmailStep onNextStep={handleNextStep} onBackStep={handleBackStep} setEmail={setEmail} />
      )}

      {step === 2 && (
        <OtpStep
          onNextStep={handleNextStep}
          onBackStep={handleBackStep}
          email={email}
          setToken={setToken}
        />
      )}

      {step === 3 && (
        <NewPasswordStep onNextStep={handleNextStep} onBackStep={handleBackStep} token="" />
      )}
    </Box>
  );
}

function EmailStep({ onNextStep, setEmail }: StepProps & { setEmail: (email: string) => void }) {
  const t = useTranslations();
  const loading = useBoolean();

  const LABELS = {
    email: t('Global.Label.email'),
  };

  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm({
    defaultValues: {
      email: 'admin@flixa.com',
    },
  });

  const { handleSubmit, getValues } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      loading.onTrue();
      setEmail(getValues('email'));
      onNextStep();
    } finally {
      loading.onFalse();
    }
  });

  const renderHead = (
    <Typography
      variant="h3"
      textTransform="capitalize"
      textAlign="center"
      color="primary.contrastText"
    >
      {t('Pages.Auth.forgot_password')}
    </Typography>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ minWidth: '100%' }}>
        {renderHead}

        <Box>
          <RHFTextField
            variant="filled"
            name="email"
            label={LABELS.email}
            color="primary"
            formLabelProps={{
              sx: {
                color: 'white',
              },
            }}
          />
          <Link
            href={paths.auth.login}
            component={RouterLink}
            color="primary.light"
            variant="caption"
            paddingInlineStart={2}
            display="inline-block"
          >
            {t('Pages.Auth.login_redirect')}
          </Link>
        </Box>

        {!!errorMsg && (
          <Alert severity="error" sx={{ mt: -4 }}>
            {errorMsg}
          </Alert>
        )}

        <LoadingButton
          fullWidth
          color="primary"
          size="large"
          type="submit"
          variant="soft"
          loading={loading.value}
          sx={{ mt: -1 }}
        >
          {t('Global.Action.confirm')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

function OtpStep({
  onNextStep,
  onBackStep,
  email,
  setToken,
}: StepProps & { email: string; setToken: (token: string) => void }) {
  const t = useTranslations();
  const loading = useBoolean();

  const LABELS = useMemo(
    () => ({
      otp: t('Global.Label.otp'),
    }),
    [t]
  );
  const [errorMsg] = useState('');

  const OtpSchema = Yup.object().shape({
    otp: Yup.string()
      .required(t('Global.Validation.var_required', { var: LABELS.otp }))
      .matches(/^[0-9]+$/, t('Global.Validation.var_only_digits', { var: LABELS.otp }))
      .length(4, t('Global.Validation.var_digits_count', { var: LABELS.otp, count: 4 })),
  });

  const methods = useForm<OtpFormValues>({
    resolver: yupResolver(OtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const { handleSubmit, getValues } = methods;

  const onSubmit = handleSubmit(async () => {
    loading.onTrue();
    setToken(getValues('otp'));
    onNextStep();
    loading.onFalse();
  });

  const renderHead = (
    <Typography
      variant="h3"
      textTransform="capitalize"
      textAlign="center"
      color="primary.contrastText"
    >
      {t('Pages.Auth.verify_otp')}
    </Typography>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ minWidth: '100%' }}>
        {renderHead}

        <Box>
          <Typography textAlign="center" color="primary.contrastText" gutterBottom>
            {t('Pages.Auth.otp_sent_to', { email })}
          </Typography>

          <RHFOTP name="otp" color="primary" />

          <ResendOtp email={email} />

          {!!errorMsg && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errorMsg}
            </Alert>
          )}
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={onBackStep}
            disabled={loading.value}
          >
            {t('Global.Action.back')}
          </Button>

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="soft"
            loading={loading.value}
          >
            {t('Global.Action.verify')}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

const ResendOtp = memo(({ email: _email }: { email: string }) => {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const [counter, setCounter] = useState(60);
  const isDisabled = counter > 0;

  useEffect(() => {
    const timer =
      counter > 0 &&
      setInterval(
        () =>
          setCounter((prev) => {
            if (prev <= 0) {
              clearInterval(timer as NodeJS.Timeout);
              return 0;
            }
            return --prev;
          }),
        1000
      );
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [counter]);

  const handleResendOtp = () => {
    setCounter(60);
    enqueueSnackbar('OTP resent successfully', { variant: 'success' });
  };

  return (
    <Link
      color="#fffc"
      textAlign="center"
      width="100%"
      variant="subtitle2"
      onClick={() => !isDisabled && handleResendOtp()}
      component="button"
      type="button"
      sx={
        isDisabled
          ? {
              color: 'text.disabled',
              cursor: 'no-drop',
            }
          : undefined
      }
    >
      {counter > 0 ? `${t('Pages.Auth.resend_otp')} (${counter}s)` : t('Pages.Auth.resend_otp')}
    </Link>
  );
});

function NewPasswordStep({ onBackStep }: StepProps & { token: string }) {
  const t = useTranslations();
  const router = useRouter();
  const loading = useBoolean();
  const showPassword = useBoolean();

  const LABELS = useMemo(
    () => ({
      password: t('Global.Label.password'),
      confirmPassword: t('Global.Label.confirm_password'),
    }),
    [t]
  );
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<PasswordFormValues>({
    defaultValues: {
      password: 'Admin@12345',
      confirmPassword: 'Admin@12345',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      loading.onTrue();
      router.push(paths.auth.login);
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : (error as Error).message);
    } finally {
      loading.onFalse();
    }
  });

  const renderHead = (
    <Typography
      variant="h3"
      textTransform="capitalize"
      textAlign="center"
      color="primary.contrastText"
    >
      {t('Pages.Auth.reset_password')}
    </Typography>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ minWidth: '100%' }}>
        {renderHead}
        <RHFTextField
          name="password"
          label={LABELS.password}
          color="primary"
          formLabelProps={{
            sx: {
              color: 'white',
            },
          }}
          variant="filled"
          type={showPassword.value ? 'text' : 'password'}
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
        />

        <RHFTextField
          name="confirmPassword"
          label={LABELS.confirmPassword}
          color="primary"
          variant="filled"
          formLabelProps={{
            sx: {
              color: 'white',
            },
          }}
          type={showPassword.value ? 'text' : 'password'}
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
        />

        {!!errorMsg && (
          <Alert severity="error" sx={{ mt: -4 }}>
            {errorMsg}
          </Alert>
        )}

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={onBackStep}
            disabled={loading.value}
          >
            {t('Global.Action.back')}
          </Button>

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="soft"
            loading={loading.value}
          >
            {t('Global.Action.reset')}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
