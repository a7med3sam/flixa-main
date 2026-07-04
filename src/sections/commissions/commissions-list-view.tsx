
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from 'framer-motion';
import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface CommissionSetting {
  commissionValue: number;
  commissionType: 'Percentage' | 'FixedValue';
  isCommissionEnabled: boolean;
}

// Extended type for UI display
interface CommissionDisplay extends CommissionSetting {
  id: string;
  status: string;
}

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const COMMISSION_TYPE_OPTIONS = [
  { value: 'Percentage', label: 'نسبة مئوية' },
  { value: 'FixedValue', label: 'قيمة ثابتة' },
];

const COMMISSION_STATUS_OPTIONS = [
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
};

// ----------------------------------------------------------------------

export default function CommissionsListView() {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [commission, setCommission] = useState<CommissionSetting | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ──────────────────────────────────────────────
  // Fetch commission settings from API
  // ──────────────────────────────────────────────
  const fetchCommissionSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<CommissionSetting>(endpoints.AdminCommissionSettings.list);
      setCommission({
        commissionValue: res.data.commissionValue,
        commissionType: (res.data.commissionType as any) === 'Fixed' ? 'FixedValue' : res.data.commissionType,
        isCommissionEnabled: res.data.isCommissionEnabled,
      });
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to load commission settings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchCommissionSettings();
  }, [fetchCommissionSettings]);

  // ──────────────────────────────────────────────
  // Transform API data to display format
  // ──────────────────────────────────────────────
  const transformToDisplay = (data: CommissionSetting | null): CommissionDisplay[] => {
    if (!data) return [];

    return [
      {
        id: '1',
        commissionValue: data.commissionValue,
        commissionType: data.commissionType,
        isCommissionEnabled: data.isCommissionEnabled,
        status: data.isCommissionEnabled ? 'active' : 'inactive',
      },
    ];
  };

  const displayData = transformToDisplay(commission);

  // ──────────────────────────────────────────────
  // Update commission settings
  // ──────────────────────────────────────────────
  const handleUpdateCommission = async (
    id: string,
    value: number,
    type: 'Percentage' | 'FixedValue',
    status: string
  ) => {
    try {
      const payload = {
        commissionValue: value,
        commissionType: type,
        isCommissionEnabled: status === 'active',
      };

      // Put to endpoints.AdminCommissionSettings.update API endpoint
      await axios.put(endpoints.AdminCommissionSettings.update, payload);

      setCommission(payload);
      enqueueSnackbar('تم تحديث إعدادات العمولة بنجاح', { variant: 'success' });
      setEditingId(null);
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || err?.message || 'Failed to update commission', { variant: 'error' });
    }
  };

  // ──────────────────────────────────────────────
  // Loading state
  // ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-grey-500 dark:text-grey-400">
            { 'جاري التحميل...'}
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Empty state
  // ──────────────────────────────────────────────
  if (!commission) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <Iconify icon="solar:folder-error-broken" className="w-24 h-24 text-grey-300 dark:text-grey-700 mb-4" />
        <p className="text-lg text-grey-500 dark:text-grey-400">لا توجد بيانات عمولة</p>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl  min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
            {t('Pages.Commissions.title') || 'إعدادات العمولات'}
          </h1>
          <p className="text-grey-500 dark:text-grey-400 font-medium">
            {t('Pages.Commissions.subtitle') || 'قم بإدارة وتعديل نسب العمولات للتطبيق بسهولة'}
          </p>
        </div>
      </div>

      {/* Cards Grid (Reverted layout to original) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 ">
        <AnimatePresence mode="wait">
          {displayData.map((item, index) => (
            <CommissionCard
              key={item.id}
              commission={item}
              isEditing={editingId === item.id}
              onToggleEdit={() => setEditingId(editingId === item.id ? null : item.id)}
              onSave={handleUpdateCommission}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Commission Card Component
// ----------------------------------------------------------------------

function CommissionCard({
  commission,
  isEditing,
  onToggleEdit,
  onSave,
  index,
}: {
  commission: CommissionDisplay;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: (id: string, value: number, type: 'Percentage' | 'FixedValue', status: string) => void;
  index: number;
}) {
  const [editValue, setEditValue] = useState(commission.commissionValue.toString());
  const [editType, setEditType] = useState<'Percentage' | 'FixedValue'>(commission.commissionType);
  const [editStatus, setEditStatus] = useState(commission.status);

  // Sync state if backend updates commission data
  useEffect(() => {
    setEditValue(commission.commissionValue.toString());
    setEditType(commission.commissionType);
    setEditStatus(commission.status);
  }, [commission]);

  const handleSave = () => {
    onSave(
      commission.id,
      parseFloat(editValue) || 0,
      editType,
      editStatus
    );
  };

  const handleCancel = () => {
    setEditValue(commission.commissionValue.toString());
    setEditType(commission.commissionType);
    setEditStatus(commission.status);
    onToggleEdit();
  };

  const statusLabel = COMMISSION_STATUS_OPTIONS.find((s) => s.value === commission.status)?.label || commission.status;
  const typeLabel = COMMISSION_TYPE_OPTIONS.find((t) => t.value === commission.commissionType)?.label || commission.commissionType;

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative overflow-hidden bg-white/30 dark:bg-[#212B36]/30 backdrop-blur-xl rounded-[2rem] border border-solid border-grey-100 dark:border-grey-800 shadow-xl shadow-grey-200/40 dark:shadow-black/20 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    >
      {/* Decorative Gradient Blob */}
      <div className="absolute -top-24 -end-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

      <div className="p-8 relative z-10">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6 " >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner transition-transform duration-300 group-hover:scale-105">
              <Iconify icon="solar:wallet-money-bold-duotone" className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-grey-900 dark:text-white mb-1">
                إعدادات العمولة
              </h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {commission.status === 'active' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${commission.status === 'active' ? 'bg-emerald-500' : 'bg-grey-400'}`} />
                </span>
                <span className="text-xs text-grey-500 dark:text-grey-400 font-medium">
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={isEditing ? handleCancel : onToggleEdit}
            className={`flex items-center justify-center w-10 h-10 rounded-full border border-solid transition-all duration-300 shadow-sm ${isEditing
                ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-red-500/30'
                : 'border-grey-200 dark:border-grey-700 bg-white dark:bg-grey-800 text-grey-600 dark:text-grey-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-primary/30'
              }`}
          >
            <Iconify icon={isEditing ? 'solar:close-circle-linear' : 'solar:pen-linear'} className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <m.div
              key="view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Display Value Panel */}
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-grey-50 to-grey-100/50 dark:from-grey-800/30 dark:to-grey-900/10 rounded-3xl border border-solid border-grey-100 dark:border-grey-700/50 mb-6 group-hover:border-primary/20 transition-all duration-300">
                <span className="text-xs font-semibold text-grey-400 dark:text-grey-500 mb-2 tracking-wide uppercase">قيمة العمولة الحالية</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-grey-900 dark:text-white tracking-tight">
                    {commission.commissionValue}
                  </span>
                  <span className="text-2xl font-black text-primary">
                    {commission.commissionType === 'Percentage' ? '%' : 'SAR'}
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-grey-50 dark:bg-grey-800/30 p-4 rounded-2xl border border-solid border-grey-100 dark:border-grey-700/30 flex flex-col items-center justify-center transition-all duration-300 hover:bg-grey-100 dark:hover:bg-grey-850/50 hover:border-grey-200 dark:hover:border-grey-700">
                  <p className="text-xs text-grey-400 dark:text-grey-500 mb-1 font-medium">نوع العمولة</p>
                  <p className="font-bold text-grey-800 dark:text-grey-200 text-sm">{typeLabel}</p>
                </div>
                <div className="bg-grey-50 dark:bg-grey-800/30 p-4 rounded-2xl border border-solid border-grey-100 dark:border-grey-700/30 flex flex-col items-center justify-center transition-all duration-300 hover:bg-grey-100 dark:hover:bg-grey-850/50 hover:border-grey-200 dark:hover:border-grey-700">
                  <p className="text-xs text-grey-400 dark:text-grey-500 mb-1 font-medium">حالة العمولة</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border border-solid ${STATUS_COLORS[commission.status] || STATUS_COLORS.inactive
                      }`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            </m.div>
          ) : (
            <m.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Value Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-grey-800 dark:text-grey-300">
                  قيمة العمولة
                </label>
                <div className="relative group/input">
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="0"
                    className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg shadow-sm"
                  />
                  <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none">
                    <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded-md">
                      {editType === 'Percentage' ? '%' : 'SAR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Adjustments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-grey-800 dark:text-grey-300">
                    نوع العمولة
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as 'Percentage' | 'FixedValue')}
                    className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium cursor-pointer shadow-sm"
                  >
                    {COMMISSION_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-grey-800 dark:text-grey-300">
                    حالة التفعيل
                  </label>
                  {/* Premium Switch Toggle */}
                  <div
                    onClick={() => setEditStatus(editStatus === 'active' ? 'inactive' : 'active')}
                    className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors shadow-sm"
                  >
                    <span className="text-sm font-semibold text-grey-600 dark:text-grey-450">
                      {editStatus === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        editStatus === 'active' ? 'bg-primary' : 'bg-grey-300 dark:bg-grey-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          editStatus === 'active' ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleSave}
                className="w-full h-12 mt-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary-dark text-white rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform hover:scale-105"
            >
                <Iconify icon="solar:check-circle-bold" className="w-5 h-5 animate-pulse" />
                حفظ التغييرات
            </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
}