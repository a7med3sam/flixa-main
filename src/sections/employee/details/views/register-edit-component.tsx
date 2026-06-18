'use client';
import { LoadingButton } from '@mui/lab';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Employee } from 'src/types/employee';
import { RHFTextField } from 'src/components/hook-form';
import { Card, Stack, Grid2, Button } from '@mui/material';
import RHFSwitch from 'src/components/hook-form/rhf-switch';

interface Props {
  employeeDetails?: Employee;
  isSubmitting: boolean;
  isSettingPermissions: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  hideSensitiveFields?: boolean;
}

export const RegisterEditComponent: React.FC<Props> = ({
  employeeDetails,
  isSubmitting,
  isSettingPermissions,
  onSubmit,
  hideSensitiveFields = false,
}) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Grid2 size={{ xs: 12, md: employeeDetails ? 6 : 12 }}>
      <Card sx={{ p: 3 }}>
        <Grid2 container spacing={2}>
          {/* Name */}
          <Grid2 size={{ xs: 12 }}>
            <RHFTextField
              name="name"
              label={t('Global.Label.name')}
              required
            />
          </Grid2>

          {/* Email */}
          <Grid2 size={{ xs: 12 }}>
            <RHFTextField
              name="email"
              label={t('Global.Label.email')}
              required
            />
          </Grid2>

          {/* Phone */}
          <Grid2 size={{ xs: 12 }}>
            <RHFTextField
              name="phoneNumber"
              label={t('Global.Label.phone')}
              required
            />
          </Grid2>

          {/* Password fields - for new employee */}
          {!employeeDetails && !hideSensitiveFields && (
            <Grid2 size={{ xs: 12 }}>
              <RHFTextField
                name="passwordNew"
                label={t('Global.Label.password')}
                type="password"
                required
              />
            </Grid2>
          )}

          {/* Password fields - for editing existing employee */}
          {employeeDetails && !hideSensitiveFields && (
            <>
              <Grid2 size={{ xs: 12 }}>
                <RHFTextField
                  name="passwordOld"
                  label={t('Pages.Employee.old_password')}
                  type="password"
                  placeholder={t('Pages.Employee.leave_empty_to_keep')}
                />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <RHFTextField
                  name="passwordNew"
                  label={t('Pages.Employee.new_password')}
                  type="password"
                  placeholder={t('Pages.Employee.leave_empty_to_keep')}
                />
              </Grid2>
            </>
          )}

          {/* Status switch */}
          {!hideSensitiveFields && (
            <Grid2 size={{ xs: 12 }}>
              <RHFSwitch
                name="status"
                label={t('Global.Label.status')}
              />
            </Grid2>
          )}
        </Grid2>

        {/* Action buttons */}
        {!hideSensitiveFields && (
          <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() =>
                router.push(paths.controlPanel.users.employee.list)
              }
            >
              {t('Global.Action.cancel')}
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting || isSettingPermissions}
              onClick={onSubmit}
            >
              {employeeDetails
                ? t('Global.Action.save')
                : t('Global.Action.register')}
            </LoadingButton>
          </Stack>
        )}
      </Card>
    </Grid2>
  );
};
