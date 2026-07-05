'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import { useEmployee } from 'src/hooks/useEmployee';

import EmployeeDeleteDialog from './employee-delete-dialog';

interface EmployeeViewProps {
  id: string;
}

function Avatar({ src, name, size = 80 }: { src?: string | null; name?: string; size?: number }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || ''}
        className="rounded-full object-cover bg-primary"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full bg-primary text-white font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 bg-grey-50 dark:bg-grey-800/40 rounded-xl">
      <span className="text-xs text-grey-500 dark:text-grey-400">{label}</span>
      <span className="text-sm font-medium text-grey-800 dark:text-grey-200">{value || '—'}</span>
    </div>
  );
}

export default function EmployeeView({ id }: EmployeeViewProps) {
  const router = useRouter();
  const t = useTranslations('');
  const { employee, loading, toggleLoading, isDeleting, handleToggleStatus, handleDelete } =
    useEmployee(id);
  const [showDelete, setShowDelete] = useState(false);

  const getGenderLabel = (gender?: string) =>
    gender === 'Male' ? 'ذكر' : gender === 'Female' ? 'أنثى' : gender || '—';

  const getStatusBadge = (isActive: boolean) => (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
      {isActive ? t('Global.Label.active') : t('Global.Label.inactive')}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-grey-500">{t('Global.Label.loading')}</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Iconify icon="mdi:account-off" className="w-16 h-16 text-grey-400 mx-auto mb-3" />
          <p className="text-grey-500">{t('Pages.Messages.no_data')}</p>
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
              onClick={() => router.push('/employees')}
              className="p-2 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 transition"
              aria-label="Back to employees list"
            >
              <Iconify icon="mdi:arrow-right" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#263238] dark:text-white">{employee.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-grey-500 dark:text-grey-400">{employee.email}</span>
                {getStatusBadge(employee.isActive)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/employees/edit/${id}`)}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition flex items-center gap-1.5"
            >
              <Iconify icon="solar:pen-linear" className="w-4 h-4" />
              {t('Global.Action.edit')}
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center mb-6 pb-6 border-b border-grey-200 dark:border-grey-700">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-2xl" />
              <div className="relative ring-4 ring-white dark:ring-[#212B36] rounded-full shadow-lg">
                <Avatar src={employee.profileImage} name={employee.name} size={104} />
              </div>
            </div>
            <h2 className="text-lg font-bold text-[#263238] dark:text-white mt-3">
              {employee.name}
            </h2>
            <p className="text-sm text-grey-500 dark:text-grey-400">
              {employee.role || 'Employee'}
            </p>
            <div className="mt-2">{getStatusBadge(employee.isActive)}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard label={t('Global.Label.name')} value={employee.name} />
            <InfoCard label={t('Global.Label.email')} value={employee.email} />
            <InfoCard label={t('Global.Label.phone')} value={employee.phoneNumber} />
            <InfoCard label={t('Global.Label.gender')} value={getGenderLabel(employee.userGender)} />
            <InfoCard label={t('Global.Label.role')} value={employee.role || 'Employee'} />
            <InfoCard
              label={t('Global.Label.registrationDate')}
              value={
                employee.registrationDate
                  ? new Date(employee.registrationDate).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'
              }
            />
          </div>
          <div className="mt-8 pt-6 border-t border-grey-200 dark:border-grey-700">
            <h3 className="text-sm font-medium text-grey-700 dark:text-grey-300 mb-3">
              {t('Pages.Messages.actions')}
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleToggleStatus}
                disabled={toggleLoading}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                  employee.isActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                } disabled:opacity-50`}
              >
                {toggleLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Iconify
                    icon={employee.isActive ? 'mdi:close' : 'mdi:check'}
                    className="w-4 h-4"
                  />
                )}
                {employee.isActive ? t('Global.Label.deactivate') : t('Global.Label.activate')}
              </button>
              <button
                onClick={() => router.push(`/employees/edit/${id}`)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
              >
                <Iconify icon="solar:pen-linear" className="w-4 h-4" />
                {t('Global.Action.edit')}
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
              >
                <Iconify icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                {t('Global.Action.delete')}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
      <EmployeeDeleteDialog
        open={showDelete}
        employeeName={employee.name}
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
