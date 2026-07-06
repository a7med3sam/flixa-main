'use client';

import type { Employee, CreateEmployeePayload, UpdateEmployeePayload } from 'src/types/employee';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  toggleEmployeeStatus,
} from 'src/services/employee.service';

interface UseEmployeeReturn {
  employee: Employee | null;
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  toggleLoading: boolean;
  fetchEmployee: () => Promise<void>;
  handleCreate: (payload: CreateEmployeePayload) => Promise<void>;
  handleUpdate: (payload: UpdateEmployeePayload) => Promise<void>;
  handleDelete: () => Promise<void>;
  handleToggleStatus: () => Promise<void>;
}

export function useEmployee(id?: string): UseEmployeeReturn {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployeeById(id);
      setEmployee(data);
    } catch (err: any) {
      const msg = err?.message || 'فشل تحميل بيانات الموظف';
      setError(msg);
      enqueueSnackbar(msg, { variant: 'error' });
      if (err?.response?.status === 404) {
        router.push('/employees');
      }
    } finally {
      setLoading(false);
    }
  }, [id, router, enqueueSnackbar]);

  useEffect(() => {
    if (id) fetchEmployee();
  }, [id, fetchEmployee]);

  const handleCreate = useCallback(
    async (payload: CreateEmployeePayload) => {
      setIsCreating(true);
      try {
        await createEmployee(payload);
        enqueueSnackbar('تم إنشاء الموظف بنجاح', { variant: 'success' });
        router.push('/employees');
      } catch (err: any) {
        enqueueSnackbar(err?.message || 'فشل إنشاء الموظف', { variant: 'error' });
      } finally {
        setIsCreating(false);
      }
    },
    [router, enqueueSnackbar]
  );

  const handleUpdate = useCallback(
    async (payload: UpdateEmployeePayload) => {
      if (!id) return;
      setIsUpdating(true);
      try {
        await updateEmployee(id, payload);
        enqueueSnackbar('تم تحديث بيانات الموظف بنجاح', { variant: 'success' });
        router.push(`/employees/${id}`);
      } catch (err: any) {
        enqueueSnackbar(err?.message || 'فشل تحديث بيانات الموظف', { variant: 'error' });
      } finally {
        setIsUpdating(false);
      }
    },
    [id, router, enqueueSnackbar]
  );

  const handleDelete = useCallback(async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteEmployee(id);
      enqueueSnackbar('تم حذف الموظف بنجاح', { variant: 'success' });
      router.push('/employees');
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'فشل حذف الموظف', { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  }, [id, router, enqueueSnackbar]);

  const handleToggleStatus = useCallback(async () => {
    if (!employee || !id) return;
    const newIsActive = !employee.isActive;
    setEmployee({ ...employee, isActive: newIsActive });
    setToggleLoading(true);
    try {
      await toggleEmployeeStatus(id, newIsActive,);
      enqueueSnackbar('تم تحديث الحالة بنجاح', { variant: 'success' });
    } catch (err: any) {
      setEmployee({ ...employee, isActive: employee.isActive });
      enqueueSnackbar(err?.message || 'فشل تحديث الحالة', { variant: 'error' });
    } finally {
      setToggleLoading(false);
    }
  }, [employee, id, enqueueSnackbar]);

  return {
    employee,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    toggleLoading,
    fetchEmployee,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
  };
}
