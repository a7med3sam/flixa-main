'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  _commissionsList,
  COMMISSION_TYPE_OPTIONS,
  COMMISSION_STATUS_OPTIONS,
} from 'src/_mock/_dashboard-commissions';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';

type DashboardCommission = (typeof _commissionsList)[number];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  active:
    'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30',
  inactive:
    'bg-grey-100 dark:bg-grey-800 text-grey-600 dark:text-grey-400 border border-solid border-grey-300 dark:border-grey-700',
  pending:
    'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30',
};

export default function CommissionsListView() {
  const t = useTranslations();
  const [commissions, setCommissions] = useState(_commissionsList);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommissions = commissions.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCommission = () => {
    const newCommission: DashboardCommission = {
      ..._commissionsList[0],
      id: Date.now().toString(),
      name: 'عمولة جديدة',
      type: 'percentage',
      rate: '0',
      minAmount: 0,
      maxAmount: 0,
      status: 'pending',
      totalTransactions: 0,
      totalAmount: 0,
      totalCommission: 0,
    };

    setCommissions((prevCommissions) => [newCommission, ...prevCommissions]);
  };

  const handleEditCommission = (commission: DashboardCommission) => {
    setCommissions((prevCommissions) =>
      prevCommissions.map((item) =>
        item.id === commission.id
          ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
          : item
      )
    );
  };

  const handleDeleteCommission = (commissionId: string) => {
    setCommissions((prevCommissions) =>
      prevCommissions.filter((commission) => commission.id !== commissionId)
    );
  };

  const actions = useMemo(
    () => [
      {
        label: 'إضافة',
        icon: <Iconify icon="solar:add-circle-bold" />,
        onClick: () => handleAddCommission(),
      },
      {
        label: 'تعديل',
        icon: <Iconify icon="solar:pen-bold" />,
        onClick: (row: DashboardCommission) => handleEditCommission(row),
      },
      {
        label: 'حذف',
        icon: <Iconify icon="solar:trash-bin-trash-bold" />,
        onClick: (row: DashboardCommission) => handleDeleteCommission(row.id),
        sx: { color: 'error.main' },
      },
    ],
    []
  );

  const customRender = useMemo(
    () => ({
      type: (commission: DashboardCommission) => (
        <span>{COMMISSION_TYPE_OPTIONS.find((t) => t.value === commission.type)?.label}</span>
      ),
      rate: (commission: DashboardCommission) => (
        <span>
          {commission.type === 'percentage' ? `${commission.rate}%` : `${commission.rate} ريال`}
        </span>
      ),
      status: (commission: DashboardCommission) => {
        const label = COMMISSION_STATUS_OPTIONS.find((s) => s.value === commission.status)?.label;
        const cls = STATUS_BADGE_CLASSES[commission.status] ?? STATUS_BADGE_CLASSES.inactive;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
          >
            {label}
          </span>
        );
      },
    }),
    []
  );

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
          <div>
            <h2 className="text-base font-bold text-[#263238] dark:text-white">
              {t('Pages.Commissions.title')}
            </h2>
            <p className="mt-0.5 text-sm text-grey-600 dark:text-grey-400">
              {t('Pages.Commissions.subtitle')}
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-grey-500 dark:text-grey-400">
              <Iconify icon="mdi:magnify" className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="البحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-10 pe-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        {/* Table */}
        <SharedTable<DashboardCommission>
          tableHead={[
            { id: 'name', label: 'Pages.Commissions.name', align: 'right' as any },
            { id: 'type', label: 'Pages.Commissions.type', align: 'right' as any },
            { id: 'rate', label: 'Pages.Commissions.rate', align: 'right' as any },
            { id: 'minAmount', label: 'Pages.Commissions.min_amount', align: 'right' as any },
            { id: 'maxAmount', label: 'Pages.Commissions.max_amount', align: 'right' as any },
            { id: 'status', label: 'Pages.Commissions.status', align: 'right' as any },
            {
              id: 'totalCommission',
              label: 'Pages.Commissions.total_commission',
              align: 'right' as any,
            },
          ]}
          data={filteredCommissions}
          count={filteredCommissions.length}
          customRender={customRender}
          actions={actions}
        />
      </div>
    </div>
  );
}
