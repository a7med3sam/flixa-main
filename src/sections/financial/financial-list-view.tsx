'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { _financialReports, _financialSummary } from 'src/_mock/_dashboard-financial';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';

type FinancialReport = (typeof _financialReports)[number];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  completed:
    'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30',
  pending:
    'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30',
  disputed: 'bg-error/10 text-error-dark dark:text-error-light border border-solid border-error/30',
};

const SUMMARY_CARDS = [
  {
    key: 'totalRevenue',
    label: 'Pages.Financial.total_revenue',
    value: _financialSummary.totalRevenue,
    bg: 'bg-[#EBF5FB] dark:bg-[#1A3A4A]',
    accent: 'bg-[#2E86C1]',
  },
  {
    key: 'totalExpenses',
    label: 'Pages.Financial.total_expenses',
    value: _financialSummary.totalExpenses,
    bg: 'bg-[#F2F3F4] dark:bg-[#2C3E50]',
    accent: 'bg-[#95A5A6]',
  },
  {
    key: 'netProfit',
    label: 'Pages.Financial.net_profit',
    value: _financialSummary.netProfit,
    extra: `${_financialSummary.profitMargin}%`,
    bg: 'bg-[#EAFAF1] dark:bg-[#1A3A2A]',
    accent: 'bg-[#27AE60]',
    valueClass: 'text-success-dark dark:text-success-light',
  },
  {
    key: 'totalCommissions',
    label: 'Pages.Financial.total_commissions',
    value: _financialSummary.totalCommissions,
    bg: 'bg-[#F5EEF8] dark:bg-[#3A2A4A]',
    accent: 'bg-[#8E44AD]',
  },
];

export default function FinancialListView() {
  const t = useTranslations();

  const actions = useMemo(
    () => [
      {
        label: t('Pages.Financial.view'),
        icon: <Iconify icon="solar:eye-bold" />,
        onClick: (row: FinancialReport) => {
          // view action
        },
      },
    ],
    [t]
  );

  const customRender = useMemo(
    () => ({
      title: (report: FinancialReport) => (
        <span className="font-medium text-grey-800 dark:text-grey-200">{report.title}</span>
      ),
      revenue: (report: FinancialReport) => (
        <span dir="ltr" className="tabular-nums">
          {report.revenue.toLocaleString()}
        </span>
      ),
      expenses: (report: FinancialReport) => (
        <span dir="ltr" className="tabular-nums">
          {report.expenses.toLocaleString()}
        </span>
      ),
      profit: (report: FinancialReport) => (
        <span
          dir="ltr"
          className="tabular-nums text-success-dark dark:text-success-light font-medium"
        >
          {report.profit.toLocaleString()}
        </span>
      ),
      profitMargin: (report: FinancialReport) => <span dir="ltr">{report.profitMargin}%</span>,
      status: (report: FinancialReport) => {
        const cls = STATUS_BADGE_CLASSES[report.status] ?? STATUS_BADGE_CLASSES.pending;
        const label =
          report.status === 'completed'
            ? t('Pages.Financial.completed')
            : report.status === 'pending'
              ? t('Pages.Financial.pending')
              : report.status;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
          >
            {label}
          </span>
        );
      },
    }),
    [t]
  );

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.key}
            className={`relative rounded-2xl px-5 py-4 flex flex-col gap-1 overflow-hidden ${card.bg}`}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
          >
            <div className={`absolute inset-x-0 top-0 h-1 ${card.accent}`} />
            <div className="text-xs font-medium opacity-70">{t(card.label)}</div>
            <div className={`text-xl font-bold tracking-tight ${card.valueClass ?? ''}`}>
              {card.value.toLocaleString()}
              <span className="text-xs font-medium opacity-60 me-1">ريال</span>
            </div>
            {card.extra && (
              <div className="text-xs text-success-dark dark:text-success-light font-medium">
                {t('Pages.Financial.profit_ratio')}: {card.extra}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Financial Reports Table */}
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
          <h2 className="text-base font-bold text-[#263238] dark:text-white">
            {t('Pages.Financial.title')}
          </h2>
        </div>
        <SharedTable<FinancialReport>
          tableHead={[
            { id: 'title', label: 'Pages.Financial.title_col', align: 'right' as any },
            { id: 'period', label: 'Pages.Financial.period', align: 'right' as any },
            { id: 'revenue', label: 'Pages.Financial.revenue', align: 'right' as any },
            { id: 'expenses', label: 'Pages.Financial.expenses', align: 'right' as any },
            { id: 'profit', label: 'Pages.Financial.profit', align: 'right' as any },
            { id: 'profitMargin', label: 'Pages.Financial.profit_margin', align: 'right' as any },
            { id: 'status', label: 'Pages.Financial.status', align: 'right' as any },
          ]}
          data={_financialReports.slice(0, 10)}
          count={10}
          customRender={customRender}
          actions={actions}
        />
      </div>
    </div>
  );
}
