'use client';

import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { endpoints } from 'src/utils/endpoints';
import { useAuthStore } from 'src/auth/auth-store';
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';
import { ProfileDto } from 'src/types/prof';
import {
  Box,
  Card,
  Grid2,
  Stack,
  Button,
  Divider,
  Tooltip,
  Typography,
  IconButton,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

// ─── OTP digit length ────────────────────────────────────────────────────────
const OTP_LENGTH = 6;

// ─── Tiny OTP Input ──────────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] || '');

  const handleChange = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char.slice(-1) : d));
    onChange(next.join(''));
    if (char && index < OTP_LENGTH - 1) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`);
      el?.focus();
    }
  };

  return (
    <Stack direction="row" spacing={1} justifyContent="center" dir="ltr">
      {digits.map((d, i) => (
        <Box
          key={i}
          component="input"
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(i, e)}
          sx={{
            width: 48,
            height: 56,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 700,
            border: '2px solid',
            borderColor: d ? 'primary.main' : 'divider',
            borderRadius: 1.5,
            outline: 'none',
            bgcolor: 'background.paper',
            color: 'text.primary',
            transition: 'border-color 0.2s',
            '&:focus': { borderColor: 'primary.main' },
            '&:disabled': { opacity: 0.5 },
          }}
        />
      ))}
    </Stack>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Card sx={{ borderRadius: 3, overflow: 'visible' }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ px: 3, pt: 3, pb: 2 }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'primary.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            flexShrink: 0,
          }}
        >
          <Iconify icon={icon} width={22} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>{children}</Box>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function EditViewProfile() {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ── Fetch profile ────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get<ProfileDto>(endpoints.profile.get);
      setProfile(res.data);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to load profile', { variant: 'error' });
    } finally {
      setLoadingProfile(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ────────────────────────────────────────────────────────────────────────────
  // 1. Edit Profile (name + image)
  // ────────────────────────────────────────────────────────────────────────────
  const profileMethods = useForm({
    defaultValues: { name: '', profileImage: null as File | string | null },
  });

  // Sync form once profile is loaded
  useEffect(() => {
    if (profile) {
      profileMethods.reset({
        name: profile.name,
        profileImage: profile.profileImage ?? null,
      });
    }
  }, [profile, profileMethods]);

  const [savingProfile, setSavingProfile] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);

  const onSubmitProfile = profileMethods.handleSubmit(async (data) => {
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('Name', data.name || '');

      if (deleteImage) {
        formData.append('DeleteProfileImage', 'true');
      } else if (data.profileImage && data.profileImage instanceof File) {
        formData.append('ProfileImage', data.profileImage);
      }

      const res = await axios.put<ProfileDto>(endpoints.profile.update, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfile(res.data);
      setDeleteImage(false);
      updateProfile({ name: res.data.name, avatar: res.data.profileImage ?? undefined });
      enqueueSnackbar(t('Global.Action.success') || 'Profile updated', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to update profile', { variant: 'error' });
    } finally {
      setSavingProfile(false);
    }
  });

  // ────────────────────────────────────────────────────────────────────────────
  // 2. Change Phone (OTP flow)
  // ────────────────────────────────────────────────────────────────────────────
  const phoneMethods = useForm({ defaultValues: { newPhoneNumber: '' } });
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneExpiry, setPhoneExpiry] = useState<string | null>(null);

  const onSendPhoneOtp = phoneMethods.handleSubmit(async (data) => {
    if (!data.newPhoneNumber.trim()) return;
    setPhoneLoading(true);
    try {
      const res = await axios.put<{ expiryTimeByMinute: string }>(
        endpoints.profile.phoneOtp,
        { newPhoneNumber: data.newPhoneNumber }
      );
      setPhoneExpiry(res.data.expiryTimeByMinute);
      setPhoneStep('otp');
      enqueueSnackbar('OTP sent to your phone', { variant: 'info' });
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to send OTP', { variant: 'error' });
    } finally {
      setPhoneLoading(false);
    }
  });

  const onVerifyPhoneOtp = async () => {
    if (phoneOtp.length < OTP_LENGTH) {
      enqueueSnackbar('Enter the full OTP code', { variant: 'warning' });
      return;
    }
    setPhoneLoading(true);
    try {
      const res = await axios.put<ProfileDto>(endpoints.profile.phoneVerify, {
        newPhoneNumber: phoneMethods.getValues('newPhoneNumber'),
        otp: phoneOtp,
      });
      setProfile(res.data);
      updateProfile({ phoneNumber: res.data.phoneNumber });
      enqueueSnackbar('Phone number updated successfully', { variant: 'success' });
      setPhoneStep('input');
      setPhoneOtp('');
      phoneMethods.reset();
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Invalid OTP', { variant: 'error' });
    } finally {
      setPhoneLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 3. Change Email (OTP flow)
  // ────────────────────────────────────────────────────────────────────────────
  const emailMethods = useForm({ defaultValues: { newEmail: '' } });
  const [emailStep, setEmailStep] = useState<'input' | 'otp'>('input');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailExpiry, setEmailExpiry] = useState<string | null>(null);

  const onSendEmailOtp = emailMethods.handleSubmit(async (data) => {
    if (!data.newEmail.trim()) return;
    setEmailLoading(true);
    try {
      const res = await axios.put<{ expiryTimeByMinute: string }>(
        endpoints.profile.emailOtp,
        { newEmail: data.newEmail }
      );
      setEmailExpiry(res.data.expiryTimeByMinute);
      setEmailStep('otp');
      enqueueSnackbar('OTP sent to your email', { variant: 'info' });
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to send OTP', { variant: 'error' });
    } finally {
      setEmailLoading(false);
    }
  });

  const onVerifyEmailOtp = async () => {
    if (emailOtp.length < OTP_LENGTH) {
      enqueueSnackbar('Enter the full OTP code', { variant: 'warning' });
      return;
    }
    setEmailLoading(true);
    try {
      const res = await axios.put<ProfileDto>(endpoints.profile.emailVerify, {
        newEmail: emailMethods.getValues('newEmail'),
        otp: emailOtp,
      });
      setProfile(res.data);
      updateProfile({ email: res.data.email });
      enqueueSnackbar('Email updated successfully', { variant: 'success' });
      setEmailStep('input');
      setEmailOtp('');
      emailMethods.reset();
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Invalid OTP', { variant: 'error' });
    } finally {
      setEmailLoading(false);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loadingProfile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid2 container spacing={3}>

      {/* ── 1. Edit Profile ──────────────────────────────────────── */}
      <Grid2 size={{ xs: 12, md: 6 }}>
        <SectionCard
          title={t('Global.Label.basic_data')}
          subtitle={t('Global.Label.profile_image') + ' & ' + t('Global.Label.name')}
          icon="solar:user-id-bold"
        >
          <FormProvider methods={profileMethods} onSubmit={onSubmitProfile}>
            {/* Avatar */}
            <Box sx={{ textAlign: 'center', mb: 3, position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
              <Box>
                <RHFUploadAvatar name="profileImage" />
                {/* Delete image toggle */}
                {(profileMethods.watch('profileImage') || profile?.profileImage) && (
                  <Tooltip title={deleteImage ? 'Undo delete' : 'Delete profile image'}>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteImage((p) => !p)}
                      sx={{
                        mt: 1,
                        color: deleteImage ? 'error.main' : 'text.secondary',
                        bgcolor: deleteImage ? 'error.lighter' : 'action.hover',
                        '&:hover': { bgcolor: deleteImage ? 'error.light' : 'action.selected' },
                      }}
                    >
                      <Iconify icon={deleteImage ? 'eva:undo-fill' : 'solar:trash-bin-trash-bold'} width={18} />
                    </IconButton>
                  </Tooltip>
                )}
                {deleteImage && (
                  <Typography variant="caption" color="error" display="block" mt={0.5}>
                    Image will be deleted on save
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Name field */}
            <RHFTextField
              name="name"
              label={t('Global.Label.name')}
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:user-bold" width={18} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Read-only info */}
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 1.5,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Iconify icon="solar:phone-bold" width={16} color="text.secondary" />
                <Typography variant="body2" color="text.secondary">
                  {profile?.phoneNumber || '—'}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 1.5,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Iconify icon="solar:letter-bold" width={16} color="text.secondary" />
                <Typography variant="body2" color="text.secondary">
                  {profile?.email || '—'}
                </Typography>
              </Box>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={savingProfile}
              startIcon={savingProfile ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="solar:floppy-disk-bold" />}
            >
              {savingProfile ? 'Saving...' : t('Global.Label.save_data')}
            </Button>
          </FormProvider>
        </SectionCard>
      </Grid2>

      {/* ── 2 & 3. Change Phone / Email ──────────────────────────── */}
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Stack spacing={3}>

          {/* Change Phone */}
          <SectionCard
            title={t('Global.Label.phone') || 'Change Phone'}
            subtitle="Verify new number with OTP"
            icon="solar:phone-calling-bold"
          >
            {phoneStep === 'input' ? (
              <FormProvider methods={phoneMethods} onSubmit={onSendPhoneOtp}>
                <RHFTextField
                  name="newPhoneNumber"
                  label={t('Global.Label.phone') || 'New Phone Number'}
                  fullWidth
                  sx={{ mb: 2 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:phone-bold" width={18} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={phoneLoading}
                  startIcon={phoneLoading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="solar:plain-2-bold" />}
                >
                  {phoneLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </FormProvider>
            ) : (
              <Stack spacing={2.5}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Enter the OTP sent to{' '}
                  <strong>{phoneMethods.getValues('newPhoneNumber')}</strong>
                  {phoneExpiry && (
                    <Typography component="span" variant="caption" color="text.disabled" display="block">
                      Expires: {new Date(phoneExpiry).toLocaleTimeString()}
                    </Typography>
                  )}
                </Typography>

                <OtpInput value={phoneOtp} onChange={setPhoneOtp} disabled={phoneLoading} />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={onVerifyPhoneOtp}
                  disabled={phoneLoading || phoneOtp.length < OTP_LENGTH}
                  startIcon={phoneLoading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="solar:check-circle-bold" />}
                >
                  {phoneLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <Button
                  variant="text"
                  color="inherit"
                  size="small"
                  onClick={() => { setPhoneStep('input'); setPhoneOtp(''); }}
                  startIcon={<Iconify icon="eva:arrow-back-fill" />}
                >
                  Back
                </Button>
              </Stack>
            )}
          </SectionCard>

          {/* Change Email */}
          <SectionCard
            title={t('Global.Label.email') || 'Change Email'}
            subtitle="Verify new email with OTP"
            icon="solar:letter-bold"
          >
            {emailStep === 'input' ? (
              <FormProvider methods={emailMethods} onSubmit={onSendEmailOtp}>
                <RHFTextField
                  name="newEmail"
                  label={t('Global.Label.email') || 'New Email'}
                  type="email"
                  fullWidth
                  sx={{ mb: 2 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:letter-bold" width={18} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={emailLoading}
                  startIcon={emailLoading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="solar:plain-2-bold" />}
                >
                  {emailLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </FormProvider>
            ) : (
              <Stack spacing={2.5}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Enter the OTP sent to{' '}
                  <strong>{emailMethods.getValues('newEmail')}</strong>
                  {emailExpiry && (
                    <Typography component="span" variant="caption" color="text.disabled" display="block">
                      Expires: {new Date(emailExpiry).toLocaleTimeString()}
                    </Typography>
                  )}
                </Typography>

                <OtpInput value={emailOtp} onChange={setEmailOtp} disabled={emailLoading} />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={onVerifyEmailOtp}
                  disabled={emailLoading || emailOtp.length < OTP_LENGTH}
                  startIcon={emailLoading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="solar:check-circle-bold" />}
                >
                  {emailLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <Button
                  variant="text"
                  color="inherit"
                  size="small"
                  onClick={() => { setEmailStep('input'); setEmailOtp(''); }}
                  startIcon={<Iconify icon="eva:arrow-back-fill" />}
                >
                  Back
                </Button>
              </Stack>
            )}
          </SectionCard>

        </Stack>
      </Grid2>
    </Grid2>
  );
}
