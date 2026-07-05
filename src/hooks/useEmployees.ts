'use client';

import type { Employee, EmployeeQueryParams } from 'src/types/employee';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect, useCallback } from 'react';
import { getEmployees, deleteEmployee, toggleEmployeeStatus } from 'src/services/employee.service';

interface UseEmployeesReturn {
  employees: Employee[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  params: EmployeeQueryParams;
  setSearch: (search: string) => void;
  setGenderFilter: (gender: string) => void;
  setStatusFilter: (isActive: boolean | undefined) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  handleToggleStatus: (employee: Employee) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 10;

export function useEmployees(): UseEmployeesReturn {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<EmployeeQueryParams>({
    skipCount: 0,
    maxResultCount: DEFAULT_PAGE_SIZE,
  });
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees(params);
      setEmployees(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load employees';
      setError(msg);
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [params, enqueueSnackbar]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const setSearch = useCallback((search: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: search || undefined, skipCount: 0 }));
    }, 400);
  }, []);

  const setGenderFilter = useCallback((userGender: string) => {
    setParams((prev) => ({
      ...prev,
      userGender: userGender || undefined,
      skipCount: 0,
    }));
  }, []);

  const setStatusFilter = useCallback((isActive: boolean | undefined) => {
    setParams((prev) => ({ ...prev, isActive, skipCount: 0 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({
      ...prev,
      skipCount: (page - 1) * (prev.maxResultCount || DEFAULT_PAGE_SIZE),
    }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setParams((prev) => ({ ...prev, maxResultCount: size, skipCount: 0 }));
  }, []);

  const setSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setParams((prev) => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const handleToggleStatus = useCallback(
    async (employee: Employee) => {
      const newIsActive = !employee.isActive;
      setEmployees((prev) =>
        prev.map((e) => (e.id === employee.id ? { ...e, isActive: newIsActive } : e))
      );
      try {
        await toggleEmployeeStatus(employee.id, newIsActive);
        enqueueSnackbar('تم تحديث الحالة بنجاح', { variant: 'success' });
      } catch (err: any) {
        setEmployees((prev) =>
          prev.map((e) => (e.id === employee.id ? { ...e, isActive: employee.isActive } : e))
        );
        enqueueSnackbar(err?.message || 'فشل تحديث الحالة', { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteEmployee(id);
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        setTotalCount((prev) => prev - 1);
        enqueueSnackbar('تم حذف الموظف بنجاح', { variant: 'success' });
      } catch (err: any) {
        enqueueSnackbar(err?.message || 'فشل حذف الموظف', { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  return {
    employees,
    totalCount,
    loading,
    error,
    params,
    setSearch,
    setGenderFilter,
    setStatusFilter,
    setPage,
    setPageSize,
    setSorting,
    handleToggleStatus,
    handleDelete,
    refetch: fetchEmployees,
  };
}
