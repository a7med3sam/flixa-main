'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import { tableRowsPerPageOptions } from '../constant';

type Props = {
  count: number;
  page: number;
  rowsPerPage: number;
  dense?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TablePaginationCustom({
  count,
  page,
  rowsPerPage,
  dense,
  onPageChange,
  onRowsPerPageChange,
  onChangeDense,
}: Props) {
  const t = useTranslations();
  const selectRef = useRef<HTMLSelectElement>(null);

  const totalPages = Math.ceil(count / rowsPerPage);
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-[#212B36] rounded-b-2xl">
      <div className="flex items-center gap-4">
        {/* Rows per page */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-grey-600 dark:text-grey-400 whitespace-nowrap">
            {t('Global.Sections.Table.rows_per_page')}
          </span>
          <div className="relative">
            <select
              ref={selectRef}
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange?.(e as any)}
              onWheel={(e) => {
                if (document.activeElement !== selectRef.current) {
                  (e.target as HTMLElement).blur();
                }
              }}
              className="text-sm font-semibold appearance-none border border-solid border-grey-200 dark:border-grey-700 rounded-xl pl-3 pr-8 py-2 bg-grey-50 dark:bg-grey-800 text-grey-800 dark:text-grey-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer hover:bg-grey-100 dark:hover:bg-grey-700 shadow-sm"
            >
              {tableRowsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-grey-500">
              <Iconify icon="eva:chevron-down-fill" className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Dense toggle */}
        {onChangeDense && (
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-grey-600 dark:text-grey-400 hover:text-grey-900 dark:hover:text-grey-100 transition-colors">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={!!dense}
                onChange={onChangeDense}
                className="peer sr-only"
              />
              <div className="w-9 h-5 bg-grey-200 dark:bg-grey-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner"></div>
            </div>
            {t('Global.Sections.Table.dense')}
          </label>
        )}
      </div>

      {/* Page info + navigation */}
      <div className="flex items-center gap-6">
        <span className="text-sm text-grey-600 dark:text-grey-400 whitespace-nowrap font-medium bg-grey-50 dark:bg-grey-800 px-3 py-1.5 rounded-lg border border-solid border-grey-200 dark:border-grey-700 shadow-sm">
          {from} - {to} <span className="mx-1 opacity-60">{t('Global.Sections.Table.of')}</span> {count}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(null, page - 1)}
            disabled={!canGoPrev}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-solid border-grey-200 dark:border-grey-700 bg-white dark:bg-grey-800 text-sm font-semibold text-grey-700 dark:text-grey-300 hover:bg-grey-50 dark:hover:bg-grey-700 hover:border-grey-300 dark:hover:border-grey-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
            aria-label={t('Global.Sections.Table.previous_page')}
          >
            <Iconify icon="eva:arrow-ios-back-fill" className="w-4 h-4 rtl:rotate-180" />
            <span className="hidden sm:inline-block">السابق</span>
          </button>

          <button
            onClick={() => onPageChange(null, page + 1)}
            disabled={!canGoNext}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-solid border-grey-200 dark:border-grey-700 bg-white dark:bg-grey-800 text-sm font-semibold text-grey-700 dark:text-grey-300 hover:bg-grey-50 dark:hover:bg-grey-700 hover:border-grey-300 dark:hover:border-grey-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
            aria-label={t('Global.Sections.Table.next_page')}
          >
            <span className="hidden sm:inline-block">التالي</span>
            <Iconify icon="eva:arrow-ios-forward-fill" className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
