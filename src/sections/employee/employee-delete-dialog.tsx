'use client';

import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';

interface EmployeeDeleteDialogProps {
  open: boolean;
  employeeName: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EmployeeDeleteDialog({
  open,
  employeeName,
  loading,
  onConfirm,
  onCancel,
}: EmployeeDeleteDialogProps) {
  const t = useTranslations('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#212B36] shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center px-6 pt-8 pb-2">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <Iconify
              icon="mdi:alert-circle-outline"
              className="w-7 h-7 text-red-500"
            />
          </div>
          <h3 className="text-base font-bold text-[#263238] dark:text-white text-center">
            {t('Global.Action.confirm_delete') || 'تأكيد الحذف'}
          </h3>
          <p className="text-sm text-grey-500 dark:text-grey-400 text-center mt-2">
            {t('Global.Action.delete_message') || 'هل أنت متأكد من حذف'}
            <span className="block font-semibold text-grey-700 dark:text-grey-200 mt-1">
              {employeeName}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-grey-700 dark:text-grey-200 border border-solid border-grey-300 dark:border-grey-600 hover:bg-grey-100 dark:hover:bg-grey-800 transition disabled:opacity-60"
          >
            {t('Global.Action.cancel') || 'إلغاء'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {t('Global.Action.delete') || 'حذف'}
          </button>
        </div>
      </div>
    </div>
  );
}
