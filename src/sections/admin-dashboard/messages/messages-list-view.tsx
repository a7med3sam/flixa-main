'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { _messagesList, MESSAGE_PRIORITY_OPTIONS } from 'src/_mock/_dashboard-messages';
import { headCellType, cellAlignment } from 'src/components/SharedTable/types';
import { DEFAULT_LIMIT } from 'src/components/constant';

// ----------------------------------------------------------------------

type DashboardMessage = (typeof _messagesList)[number];

const TABLE_HEAD: headCellType[] = [
  { id: 'status', label: 'Pages.Messages.status', align: cellAlignment.right },
  { id: 'senderName', label: 'Pages.Messages.sender_name', align: cellAlignment.right },
  { id: 'subject', label: 'Pages.Messages.subject', align: cellAlignment.right },
  { id: 'category', label: 'Pages.Messages.category', align: cellAlignment.right },
  { id: 'priority', label: 'Pages.Messages.priority', align: cellAlignment.right },
  { id: 'receivedAt', label: 'Pages.Messages.date', align: cellAlignment.right },
  { id: 'actions', label: 'Pages.Messages.actions', align: cellAlignment.right },
];

const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  urgent: 'bg-error/10 text-error-dark dark:text-error-light border border-solid border-error/30',
  high: 'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30',
  medium: 'bg-info/10 text-info-dark dark:text-info-light border border-solid border-info/30',
  low: 'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30',
};

const STATUS_ICONS: Record<string, string> = {
  new: 'mdi:email',
  read: 'mdi:email-open',
  replied: 'mdi:reply',
  archived: 'mdi:archive',
};

// ----------------------------------------------------------------------

export default function MessagesListView() {
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const t = useTranslations();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || DEFAULT_LIMIT;

  const filteredMessages = _messagesList.filter(
    (msg) =>
      msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedMessages = filteredMessages.slice(start, end);

  const unreadCount = _messagesList.filter((m) => !m.isRead).length;

  const customRender = useMemo(
    () => ({
      status: (row: DashboardMessage) => (
        <Iconify icon={STATUS_ICONS[row.status] || 'mdi:email'} className="w-5 h-5" />
      ),
      subject: (row: DashboardMessage) => (
        <span className={!row.isRead ? 'font-bold' : 'font-normal'}>{row.subject}</span>
      ),
      priority: (row: DashboardMessage) => {
        const label = MESSAGE_PRIORITY_OPTIONS.find((p) => p.value === row.priority)?.label;
        const cls = PRIORITY_BADGE_CLASSES[row.priority] || '';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
          >
            {label}
          </span>
        );
      },
      receivedAt: (row: DashboardMessage) => (
        <span>{new Date(row.receivedAt).toLocaleDateString('ar-SA')}</span>
      ),
      actions: () => (
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-solid border-grey-300 dark:border-grey-700 text-grey-700 dark:text-grey-300 hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors">
            {t('Pages.Messages.view')}
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-solid border-success/30 text-success-dark dark:text-success-light hover:bg-success/10 transition-colors">
            {t('Pages.Messages.reply')}
          </button>
        </div>
      ),
    }),
    []
  );

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#263238] dark:text-white">
                {t('Pages.Messages.title')}
              </h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-error text-[11px] font-bold text-white leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-grey-600 dark:text-grey-400">
              {t('Pages.Messages.subtitle')}
            </p>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-grey-500 dark:text-grey-400">
              <Iconify icon="mdi:magnify" className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder={t('Pages.Messages.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-10 pe-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <SharedTable<DashboardMessage>
          tableHead={TABLE_HEAD}
          data={paginatedMessages}
          count={filteredMessages.length}
          customRender={customRender}
          showPagination
        />
      </div>
    </div>
  );
}
