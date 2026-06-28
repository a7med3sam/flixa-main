'use client';

import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { headCellType } from 'src/components/SharedTable/types';
import { DEFAULT_LIMIT } from 'src/components/constant';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface SupportTicket {
  id: string;
  status: string; // 'new' | 'read' | 'replied' | 'archived'
  name: string;
  email: string;
  message: string;
  closedAt: string | null;
  creationTime: string;
}

interface SupportTicketsResponse {
  items: SupportTicket[];
  totalCount: number;
}

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const TABLE_HEAD: headCellType[] = [
  { id: 'status', label: 'Pages.Messages.status' },
  { id: 'name', label: 'Pages.Messages.sender_name' },
  { id: 'subject', label: 'Pages.Messages.subject' },
  { id: 'category', label: 'Pages.Messages.category' },
  { id: 'priority', label: 'Pages.Messages.priority' },
  { id: 'creationTime', label: 'Pages.Messages.date' },
  { id: 'actions', label: 'Pages.Messages.actions' },
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

// For demo purposes - since API doesn't have these fields yet
const MOCK_PRIORITY = ['urgent', 'high', 'medium', 'low'];
const MOCK_CATEGORY = ['عام', 'شكاوى', 'استفسارات', 'اقتراحات'];
const MOCK_SUBJECTS = [
  'مشكلة في الدعم',
  'استفسار عن المنتج',
  'شكوى عن الشحن',
  'طلب استرجاع',
];

// ----------------------------------------------------------------------

export default function MessagesListView() {
  const { enqueueSnackbar } = useSnackbar();
  const t = useTranslations();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // ──────────────────────────────────────────────
  // Fetch tickets from API
  // ──────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<SupportTicketsResponse>(endpoints.message.list);
      const data = res.data;
      setTickets(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to load messages', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ──────────────────────────────────────────────
  // Filter tickets
  // ──────────────────────────────────────────────
  const filteredTickets = useMemo(() => {
    if (!searchTerm.trim()) return tickets;

    return tickets.filter(
      (ticket) =>
        ticket.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tickets, searchTerm]);

  // ──────────────────────────────────────────────
  // Helper: get mock data for missing fields
  // ──────────────────────────────────────────────
  const getMockPriority = (id: string) => {
    const index = id.charCodeAt(id.length - 1) % MOCK_PRIORITY.length;
    return MOCK_PRIORITY[index];
  };

  const getMockCategory = (id: string) => {
    const index = id.charCodeAt(id.length - 2) % MOCK_CATEGORY.length;
    return MOCK_CATEGORY[index];
  };

  const getMockSubject = (id: string) => {
    const index = id.charCodeAt(id.length - 3) % MOCK_SUBJECTS.length;
    return MOCK_SUBJECTS[index];
  };

  // ──────────────────────────────────────────────
  // Custom render for table cells
  // ──────────────────────────────────────────────
  const customRender = useMemo(
    () => ({
      status: (row: SupportTicket) => (
        <Iconify
          icon={STATUS_ICONS[row.status] || 'mdi:email'}
          className="w-5 h-5"
        />
      ),
      name: (row: SupportTicket) => (
        <span className={row.status === 'new' ? 'font-bold' : 'font-normal'}>
          {row.name}
        </span>
      ),
      subject: (row: SupportTicket) => {
        // Use message as subject since API doesn't have subject field
        const subject = row.message?.slice(0, 30) || getMockSubject(row.id);
        return (
          <span className={row.status === 'new' ? 'font-bold' : 'font-normal'}>
            {subject.length > 30 ? `${subject}...` : subject}
          </span>
        );
      },
      category: (row: SupportTicket) => (
        <span>{getMockCategory(row.id)}</span>
      ),
      priority: (row: SupportTicket) => {
        const priority = getMockPriority(row.id);
        const label = priority.charAt(0).toUpperCase() + priority.slice(1);
        const cls = PRIORITY_BADGE_CLASSES[priority] || '';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
          >
            {label}
          </span>
        );
      },
      creationTime: (row: SupportTicket) => (
        <span>
          {row.creationTime
            ? new Date(row.creationTime).toLocaleDateString('ar-SA')
            : '—'}
        </span>
      ),
      actions: (row: SupportTicket) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewTicket(row)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-solid border-grey-300 dark:border-grey-700 text-grey-700 dark:text-grey-300 hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors"
          >
            {t('Pages.Messages.view')}
          </button>
          <button
            onClick={() => handleReplyTicket(row)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-solid border-success/30 text-success-dark dark:text-success-light hover:bg-success/10 transition-colors"
          >
            {t('Pages.Messages.reply')}
          </button>
        </div>
      ),
    }),
    [t]
  );

  // ──────────────────────────────────────────────
  // Handlers for actions
  // ──────────────────────────────────────────────
  const handleViewTicket = (ticket: SupportTicket) => {
    router.push(`/messages/${ticket.id}`);
  };

  const handleReplyTicket = (ticket: SupportTicket) => {
    // TODO: Open reply dialog or navigate to reply page
    enqueueSnackbar(`Replying to: ${ticket.name}`, { variant: 'info' });
  };

  // ──────────────────────────────────────────────
  // Count unread tickets
  // ──────────────────────────────────────────────
  const unreadCount = useMemo(
    () => tickets.filter((t) => t.status === 'new').length,
    [tickets]
  );

  // ──────────────────────────────────────────────
  // Loading state
  // ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-grey-500 dark:text-grey-400 text-sm">
            {t('Global.Loading.loading') || 'Loading messages...'}
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        {/* Header */}
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

          {/* Search */}
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

        {/* Table */}
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Iconify icon="mdi:inbox-outline" className="w-16 h-16 text-grey-300 dark:text-grey-600 mb-4" />
            <p className="text-grey-500 dark:text-grey-400 text-sm">
              {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد رسائل حتى الآن'}
            </p>
          </div>
        ) : (
          <SharedTable<SupportTicket>
            tableHead={TABLE_HEAD}
            data={filteredTickets}
            count={filteredTickets.length}
            customRender={customRender}
            showPagination
          />
        )}
      </div>
    </div>
  );
}