'use client';

import type { Employee } from 'src/types/employee';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import { useEmployees } from 'src/hooks/useEmployees';
import SharedTable from 'src/components/SharedTable/SharedTable';

import EmployeeDeleteDialog from './employee-delete-dialog';
import { GENDER_OPTIONS, STATUS_OPTIONS, getGenderLabel } from './employee.utils';

const TABLE_HEAD = [
  { id: 'name', label: 'Global.Label.name' },
  { id: 'email', label: 'Global.Label.email' },
  { id: 'phoneNumber', label: 'Global.Label.phone' },
  { id: 'userGender', label: 'Global.Label.gender' },
  { id: 'isActive', label: 'Global.Label.status' },
  { id: 'actions', label: 'Pages.Messages.actions' },
];

export default function EmployeeListView() {
  const router = useRouter();
  const t = useTranslations('');
  const {
    employees,
    totalCount,
    loading,
    error,
    setSearch,
    setGenderFilter,
    setStatusFilter,
    handleToggleStatus,
    handleDelete,
  } = useEmployees();

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const handleNavigateToCreate = () => {
    router.push('/employees/new');
  };

  const handleNavigateToView = (id: string) => {
    router.push(`/employees/${id}`);
  };

  const handleNavigateToEdit = (id: string) => {
    router.push(`/employees/edit/${id}`);
  };

  const customRender = useMemo(
    () => ({
      name: (employee: Employee) => (
        <div className="flex items-center gap-2.5">
          {employee.profileImage ? (
            <img
              src={employee.profileImage}
              alt={employee.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
              {employee.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
          <span className="text-sm font-medium text-grey-800 dark:text-grey-200">
            {employee.name}
          </span>
        </div>
      ),
      userGender: (employee: Employee) => (
        <span className="text-sm text-grey-700 dark:text-grey-300">
          {getGenderLabel(employee.userGender)}
        </span>
      ),
      isActive: (employee: Employee) => (
        <div className="inline-flex items-center gap-1.5 px-3 py-1">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              employee.isActive ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
            }`}
          />
          <span
            className={`text-xs font-medium leading-none ${
              employee.isActive ? 'text-[#16a34a]' : 'text-[#dc2626]'
            }`}
          >
            {employee.isActive ? t('Global.Label.active') : t('Global.Label.inactive')}
          </span>
        </div>
      ),
      actions: (employee: Employee) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigateToView(employee.id)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EDF4FF] border-0 text-[#2077FF] text-xs font-medium cursor-pointer transition-all hover:bg-blue-500/20"
          >
            <Iconify icon="solar:eye-linear" style={{ width: 14, height: 14 }} />
            {t('Global.Action.view')}
          </button>
          <button
            type="button"
            onClick={() => handleNavigateToEdit(employee.id)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFF8E1] border-0 text-[#F9A825] text-xs font-medium cursor-pointer transition-all hover:bg-yellow-500/20"
          >
            <Iconify icon="solar:pen-linear" style={{ width: 14, height: 14 }} />
            {t('Global.Action.edit')}
          </button>
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${
              employee.isActive ? 'bg-[#FDECEC]' : 'bg-[#E8FBF0]'
            }`}
          >
            <button
              type="button"
              dir="ltr"
              role="switch"
              aria-checked={employee.isActive}
              onClick={() => handleToggleStatus(employee)}
              className={`relative inline-flex h-3 w-5 shrink-0 items-center rounded-full border-0 transition-colors duration-200 ${
                employee.isActive ? 'bg-[#2ecc71]' : 'bg-[#c4ccd4]'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-2 w-2 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  employee.isActive ? 'translate-x-2' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs leading-none select-none ${
                employee.isActive ? 'text-[#ef4444]' : 'text-[#16a34a]'
              }`}
            >
              {employee.isActive ? t('Global.Label.deactivate') : t('Global.Label.activate')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDeleteTarget(employee)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FDECEC] border-0 text-[#ef4444] text-xs font-medium cursor-pointer transition-all hover:bg-red-200"
          >
            <Iconify icon="solar:trash-bin-trash-linear" style={{ width: 14, height: 14 }} />
            {t('Global.Action.delete')}
          </button>
        </div>
      ),
    }),
    [handleToggleStatus, handleNavigateToView, handleNavigateToEdit, t]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-grey-50 dark:bg-[#1a1a1a] p-4 md:p-6">
        <div className="w-full">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
          <div className="px-6 py-5 border-b border-grey-200 dark:border-grey-700">
            <div className="h-6 w-40 bg-grey-200 dark:bg-grey-700 rounded animate-pulse" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 border-b border-grey-100 dark:border-grey-800"
            >
              <div className="h-4 w-32 bg-grey-200 dark:bg-grey-700 rounded animate-pulse" />
              <div className="h-4 w-48 bg-grey-200 dark:bg-grey-700 rounded animate-pulse" />
              <div className="h-4 w-28 bg-grey-200 dark:bg-grey-700 rounded animate-pulse" />
              <div className="h-4 w-16 bg-grey-200 dark:bg-grey-700 rounded animate-pulse" />
              <div className="h-4 w-16 bg-grey-200 dark:bg-grey-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-grey-200 dark:bg-grey-700 rounded animate-pulse" />
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-50 dark:bg-[#1a1a1a] p-4 md:p-6">
      <div className="w-full">
        <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-grey-200 dark:border-grey-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 transition"
              aria-label="Back"
            >
              <Iconify icon="mdi:arrow-right" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#263238] dark:text-white">
                {t('Global.Label.employees')}
              </h1>
              <p className="text-xs text-grey-500 dark:text-grey-400 mt-0.5">
                {totalCount} {t('Global.Label.employees')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-grey-500">
                <Iconify icon="mdi:magnify" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder={t('Pages.Messages.search_placeholder')}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-10 pe-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition w-48"
              />
            </div>
            <select
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => {
                const val = e.target.value;
                setStatusFilter(val === '' ? undefined : val === 'true');
              }}
              className="px-3 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleNavigateToCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer transition-all hover:bg-primary-dark"
            >
              <Iconify icon="mdi:plus" className="w-5 h-5" />
              {t('Global.Action.add_employee')}
            </button>
          </div>
        </div>
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Iconify icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400 mb-3" />
            <p className="text-sm text-grey-500 mb-4">{error}</p>
          </div>
        ) : (
          <SharedTable<Employee>
            tableHead={TABLE_HEAD}
            data={employees}
            count={totalCount}
            customRender={customRender}
            actions={[]}
          />
        )}
        </div>
      </div>
      <EmployeeDeleteDialog
        open={!!deleteTarget}
        employeeName={deleteTarget?.name || ''}
        loading={false}
        onConfirm={async () => {
          if (deleteTarget) {
            await handleDelete(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
