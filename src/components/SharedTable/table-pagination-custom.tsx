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
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-solid border-grey-200 dark:border-grey-700 bg-white dark:bg-[#212B36] rounded-b-xl">
      <div className="flex items-center gap-4">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-grey-600 dark:text-grey-400 whitespace-nowrap">
            {t('Global.Sections.Table.rows_per_page')}
          </span>
          <select
            ref={selectRef}
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange?.(e as any)}
            onWheel={(e) => {
              if (document.activeElement !== selectRef.current) {
                (e.target as HTMLElement).blur();
              }
            }}
            className="text-sm border border-solid border-grey-300 dark:border-grey-700 rounded-lg px-2 py-1.5 bg-white dark:bg-grey-800 text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-shadow"
          >
            {tableRowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Dense toggle */}
        {onChangeDense && (
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-grey-600 dark:text-grey-400 hover:text-grey-800 dark:hover:text-grey-200 transition-colors">
            <input
              type="checkbox"
              checked={!!dense}
              onChange={onChangeDense}
              className="w-4 h-4 accent-primary rounded border-grey-300 dark:border-grey-600"
            />
            {t('Global.Sections.Table.dense')}
          </label>
        )}
      </div>

      {/* Page info + navigation */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-grey-600 dark:text-grey-400 whitespace-nowrap font-medium">
          {from}-{to} {t('Global.Sections.Table.of')} {count}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(null, page - 1)}
            disabled={!canGoPrev}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-600 dark:text-grey-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label={t('Global.Sections.Table.previous_page')}
          >
            <Iconify icon="eva:arrow-ios-back-fill" className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={() => onPageChange(null, page + 1)}
            disabled={!canGoNext}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-600 dark:text-grey-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label={t('Global.Sections.Table.next_page')}
          >
            <Iconify icon="eva:arrow-ios-forward-fill" className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
