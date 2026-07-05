'use client';

import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';

interface TablePaginationProps {
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  showDenseToggle?: boolean;
  dense?: boolean;
  onDenseChange?: (dense: boolean) => void;
}

export default function TablePagination({
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  showDenseToggle = false,
  dense = false,
  onDenseChange,
}: TablePaginationProps) {
  const t = useTranslations('');
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startIndex = page * rowsPerPage + 1;
  const endIndex = Math.min((page + 1) * rowsPerPage, totalCount);

  const handlePrevious = () => {
    if (page > 0) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) onPageChange(page + 1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRowsPerPageChange(Number(e.target.value));
    onPageChange(0);
  };

  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-grey-200 dark:border-grey-700">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-sm text-grey-600 dark:text-grey-400 whitespace-nowrap">
          {t('Global.Sections.Table.rows_per_page')}:
        </span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="px-2 py-1.5 rounded-lg border border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-grey-600 dark:text-grey-400 whitespace-nowrap">
        {totalCount > 0 ? (
          <>
            {startIndex}-{endIndex} {t('Global.Sections.Table.of')} {totalCount}
          </>
        ) : (
          `0 ${t('Global.Sections.Table.of')} 0`
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          className="p-1.5 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="First page"
        >
          <Iconify icon="mdi:chevron-double-right" className="w-5 h-5" />
        </button>

        <button
          onClick={handlePrevious}
          disabled={page === 0}
          className="p-1.5 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <Iconify icon="mdi:chevron-right" className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 mx-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber: number;
            if (totalPages <= 5) {
              pageNumber = i;
            } else if (page < 3) {
              pageNumber = i;
            } else if (page > totalPages - 3) {
              pageNumber = totalPages - 5 + i;
            } else {
              pageNumber = page - 2 + i;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition ${
                  page === pageNumber
                    ? 'bg-primary text-white'
                    : 'hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-700 dark:text-grey-300'
                }`}
              >
                {pageNumber + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <Iconify icon="mdi:chevron-left" className="w-5 h-5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Last page"
        >
          <Iconify icon="mdi:chevron-double-left" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
