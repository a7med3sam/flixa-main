'use client';


import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { endpoints } from 'src/utils/endpoints';
import { yupResolver } from '@hookform/resolvers/yup';
import { FetchTags } from 'src/actions/config-actions';
import { useForm, FormProvider } from 'react-hook-form';
import React, { useRef, useState, useEffect } from 'react';
import { Card, Grid2, Stack, Button } from '@mui/material';
import { editData, postData } from 'src/utils/crud-fetch-api';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { Employee, EmployeePermission } from 'src/types/employee';

import PermissionTable from './views/permissions-table';
import { RegisterEditComponent } from './views/register-edit-component';

interface PermissionPayload {
  employeeId: string;
  permissionActionId: string;
}

interface Props {
  employeeDetails?: Employee;
  permissionList?: EmployeePermission[];
}

export default function NewEditForm({ employeeDetails, permissionList }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const [showPermissionTable, setShowPermissionTable] = useState(false);

  const [newEmployeeId, setNewEmployeeId] = useState<string | null>(null);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(!!employeeDetails);
  const [isSettingPermissions, setIsSettingPermissions] = useState(false);

  const isEdit = !!employeeDetails;

  // Password validation schema
  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    status: yup.boolean(),

    passwordNew: yup
      .string()
      .nullable()
      .notRequired()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Must include a lowercase letter')
      .matches(/[A-Z]/, 'Must include an uppercase letter')
      .matches(/\d/, 'Must include a number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must include a special character'),
  });

  const methods = useForm<
    Employee & {
      permissions: Record<string, string[]>;
      passwordNew?: string;
      passwordOld?: string;
    }
  >({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: isEdit ? employeeDetails.name : '',
      email: isEdit ? employeeDetails.email : '',
      phoneNumber: isEdit ? employeeDetails.phoneNumber : '',
      status: isEdit ? (employeeDetails.status ? 'Active' : 'Blocked') : true, // or false based on your default status logic
      passwordNew: '',
      passwordOld: '',
      permissions: {},
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const permissions = watch('permissions');

  useEffect(() => {
    if (!employeeDetails) {
      methods.reset({
        name: '',
        email: '',
        phoneNumber: '',
        passwordNew: '',
        passwordOld: '',
        status: true, // or false
        permissions: {},
      });
    }
  }, [employeeDetails, methods]);
  useEffect(() => {
    if (employeeDetails?.employeePermissions) {
      const initialPermissions: Record<string, string[]> = {};
      employeeDetails.employeePermissions.forEach((perm) => {
        initialPermissions[perm.key] = perm.permissionActions.map((action) => action.key);
      });
      methods.setValue('permissions', initialPermissions);
    }
  }, [employeeDetails, methods]);
  useEffect(() => {
    const prevPath = prevPathRef.current;

    // Update previous path after checking logic
    prevPathRef.current = pathname;

    // Check if route changed from /register to /edit/...
    if (prevPath === paths.controlPanel.users.employee.register) {
      setShowPermissionTable(true);
    }
  }, [pathname]);

  const handlePermissionUpdate = async (permissionKey: string, actionKey: string) => {
    const employeeId = employeeDetails?.id || newEmployeeId;
    if (!employeeId) return;

    setIsSettingPermissions(true);
    const permission = permissionList?.find((p) => p.key === permissionKey);
    const action = permission?.actions.find((a) => a.key === actionKey);

    if (!action) return;

    const payload: PermissionPayload = {
      employeeId,
      permissionActionId: action.id,
    };

    try {
      await postData(endpoints.employee.editPermission, payload);
      const current = permissions?.[permissionKey] || [];
      const updated = current.includes(actionKey)
        ? current.filter((a) => a !== actionKey)
        : [...current, actionKey];

      setValue(`permissions.${permissionKey}`, updated);

      enqueueSnackbar(
        t('Global.Server.Success.var_updated', {
          var: t('Pages.Employee.permissions'),
        }),
        { variant: 'success' }
      );
    } catch (error: any) {
      enqueueSnackbar(error.message || t('Global.Server.Error.generic'), { variant: 'error' });
    } finally {
      setIsSettingPermissions(false);
    }
  };

  const handleRegisterEmployee = async (data: any) => {
    const statusForBackend = data.status ? 'Active' : 'Blocked';
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phoneNumber,
      passwordHash: data.passwordNew,
      status: statusForBackend,
    };

    try {
      const res = (await postData(endpoints.employee.create, payload)) as any;
      if (res.success) {
        setNewEmployeeId(res?.data?.data?.id);
        setIsRegistrationComplete(true);
        enqueueSnackbar(t('Global.Server.Success.var_created', { var: t('Nav.Users.employees') }), {
          variant: 'success',
        });
        invalidateTag(FetchTags.EmployeesList);
        // Redirect to edit page with new employee ID
        router.push(paths.controlPanel.users.employee.edit(res?.data?.data?.id));
      } else {
        throw new Error(res.error || t('Global.Server.Error.generic'));
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || t('Global.Server.Error.generic'), {
        variant: 'error',
      });
    }
  };

  const handleUpdateEmployee = async (data: any) => {
    const statusForBackend = data.status ? 'Active' : 'Blocked';
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      passwordOld: data.passwordOld,
      passwordNew: data.passwordNew,
      status: statusForBackend,
      permissions: data.permissions,
    };

    try {
      const res = await editData(
        endpoints.employee.patch(employeeDetails?.id || ''),
        'PUT',
        payload
      );
      if (res.success) {
        enqueueSnackbar(t('Global.Server.Success.var_updated', { var: t('Nav.Users.employees') }), {
          variant: 'success',
        });
        invalidateTag(FetchTags.EmployeesList);
        router.push(paths.controlPanel.users.employee.list);
      } else {
        throw new Error(res.error || t('Global.Server.Error.generic'));
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || t('Global.Server.Error.generic'), {
        variant: 'error',
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (employeeDetails) {
      await handleUpdateEmployee(data);
    } else {
      await handleRegisterEmployee(data);
    }
  });
  return (
    <FormProvider {...methods}>
      <Grid2 container spacing={3}>
        {(!employeeDetails && !isRegistrationComplete && !showPermissionTable) ||
        employeeDetails ? (
          <RegisterEditComponent
            employeeDetails={employeeDetails}
            isSubmitting={isSubmitting}
            isSettingPermissions={isSettingPermissions}
            onSubmit={onSubmit}
          />
        ) : null}

        {/* Permissions Table - Show in edit mode or after successful registration or route change from /register to /edit */}
        {(employeeDetails || isRegistrationComplete || showPermissionTable) && (
          <Grid2 size={{ xs: 12, md: employeeDetails ? 6 : 12 }}>
            <Card sx={{ p: 3 }}>
              <PermissionTable
                permissionList={permissionList || []}
                permissions={permissions || {}}
                handleCheck={handlePermissionUpdate}
              />
              {isRegistrationComplete && !employeeDetails && (
                <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={() => router.push(paths.controlPanel.users.employee.list)}
                  >
                    {t('Global.Action.finish')}
                  </Button>
                </Stack>
              )}
            </Card>
          </Grid2>
        )}
      </Grid2>
    </FormProvider>
  );
}