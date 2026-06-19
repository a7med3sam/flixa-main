'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { _contentPages } from 'src/_mock/_dashboard-content';
import { headCellType, cellAlignment } from 'src/components/SharedTable/types';

// ----------------------------------------------------------------------

type DashboardContentPage = (typeof _contentPages)[number];

const TABLE_HEAD: headCellType[] = [
  { id: 'title', label: 'Pages.Content.title_col', align: cellAlignment.right },
  { id: 'language', label: 'Pages.Content.language_col', align: cellAlignment.right },
  { id: 'status', label: 'Pages.Content.status_col', align: cellAlignment.right },
  { id: 'lastUpdated', label: 'Pages.Content.last_updated_col', align: cellAlignment.right },
  { id: 'views', label: 'Pages.Content.views_col', align: cellAlignment.right },
  { id: 'actions', label: 'Pages.Content.actions_col', align: cellAlignment.right },
];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  published:
    'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30',
  draft:
    'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30',
  archived:
    'bg-grey-100 dark:bg-grey-800 text-grey-600 dark:text-grey-400 border border-solid border-grey-300 dark:border-grey-700',
};

// ----------------------------------------------------------------------

export default function ContentListView() {
  const router = useRouter();
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPages = _contentPages.filter((page) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customRender = useMemo(
    () => ({
      language: (row: DashboardContentPage) => (
        <span>
          {row.language === 'ar' ? t('Pages.Content.arabic') : t('Pages.Content.english')}
        </span>
      ),
      status: (row: DashboardContentPage) => {
        const cls = STATUS_BADGE_CLASSES[row.status] || '';
        const label =
          row.status === 'published'
            ? t('Pages.Content.published')
            : row.status === 'draft'
              ? t('Pages.Content.draft')
              : row.status;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
          >
            {label}
          </span>
        );
      },
      lastUpdated: (row: DashboardContentPage) => (
        <span>{new Date(row.lastUpdated).toLocaleDateString('ar-SA')}</span>
      ),
      views: (row: DashboardContentPage) => <span>{row.views.toLocaleString()}</span>,
      actions: (row: DashboardContentPage) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/content/${row.slug}`)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-solid border-grey-300 dark:border-grey-700 text-grey-700 dark:text-grey-300 hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors"
          >
            {t('Pages.Content.edit_action')}
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-solid border-error/30 text-error-dark dark:text-error-light hover:bg-error/10 transition-colors">
            {t('Pages.Content.delete_action')}
          </button>
        </div>
      ),
    }),
    [t]
  );

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
          <div>
            <h2 className="text-base font-bold text-[#263238] dark:text-white">
              {t('Pages.Content.admin_title')}
            </h2>
            <p className="mt-0.5 text-sm text-grey-600 dark:text-grey-400">
              {t('Pages.Content.admin_subtitle')}
            </p>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-grey-500 dark:text-grey-400">
              <Iconify icon="mdi:magnify" className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder={t('Pages.Content.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-10 pe-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <SharedTable<DashboardContentPage>
          tableHead={TABLE_HEAD}
          data={filteredPages}
          count={filteredPages.length}
          customRender={customRender}
        />
      </div>
    </div>
  );
}
