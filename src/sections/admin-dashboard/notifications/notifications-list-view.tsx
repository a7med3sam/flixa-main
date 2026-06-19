'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';
import {
  _notificationsList,
  NOTIFICATION_TYPE_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS,
  NOTIFICATION_RECIPIENTS_OPTIONS,
} from 'src/_mock/_dashboard-notifications';
import { headCellType, cellAlignment } from 'src/components/SharedTable/types';

// ----------------------------------------------------------------------

type DashboardNotification = (typeof _notificationsList)[number];

type NotificationFormData = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: string;
  recipients: string;
  language: string;
};

const TABLE_HEAD: headCellType[] = [
  { id: 'titleAr', label: 'Pages.Notification.title_ar_col', align: cellAlignment.right },
  { id: 'type', label: 'Pages.Notification.type_col', align: cellAlignment.right },
  { id: 'status', label: 'Pages.Notification.status_col', align: cellAlignment.right },
  { id: 'recipientCount', label: 'Pages.Notification.recipients_col', align: cellAlignment.right },
  { id: 'successRate', label: 'Pages.Notification.success_rate', align: cellAlignment.right },
  { id: 'createdAt', label: 'Pages.Notification.date_col', align: cellAlignment.right },
];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  sent: 'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30',
  scheduled:
    'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30',
  draft:
    'bg-grey-100 dark:bg-grey-800 text-grey-600 dark:text-grey-400 border border-solid border-grey-300 dark:border-grey-700',
  failed: 'bg-error/10 text-error-dark dark:text-error-light border border-solid border-error/30',
};

const defaultFormData: NotificationFormData = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  type: 'announcement',
  recipients: 'all',
  language: 'both',
};

// ----------------------------------------------------------------------

export default function NotificationsListView() {
  const t = useTranslations();
  const [notifications, setNotifications] = useState(_notificationsList);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<DashboardNotification | null>(null);
  const [formData, setFormData] = useState<NotificationFormData>(defaultFormData);

  const filteredNotifications = notifications.filter((n) =>
    n.titleAr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sentCount = notifications.filter((n) => n.status === 'sent').length;
  const scheduledCount = notifications.filter((n) => n.status === 'scheduled').length;
  const draftCount = notifications.filter((n) => n.status === 'draft').length;

  const handleOpenDialog = () => {
    setSelectedNotif(null);
    setFormData(defaultFormData);
    setOpenDialog(true);
  };

  const handleEditNotification = (notification: DashboardNotification) => {
    setSelectedNotif(notification);
    setFormData({
      titleAr: notification.titleAr,
      titleEn: notification.titleEn,
      descriptionAr: notification.descriptionAr,
      descriptionEn: notification.descriptionEn,
      type: notification.type,
      recipients: notification.recipients,
      language: notification.language,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotif(null);
  };

  const handleCreateNotification = () => {
    if (selectedNotif) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === selectedNotif.id ? { ...notification, ...formData } : notification
        )
      );
    } else {
      const newNotification: DashboardNotification = {
        ..._notificationsList[0],
        ...formData,
        id: Date.now().toString(),
        status: 'draft',
        recipientCount: 0,
        successCount: 0,
        failureCount: 0,
        createdAt: new Date(),
        sentAt: null,
      };

      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
    }

    handleCloseDialog();
  };

  const handleViewNotification = (notification: DashboardNotification) => {
    setSelectedNotif(notification);
    setFormData({
      titleAr: notification.titleAr,
      titleEn: notification.titleEn,
      descriptionAr: notification.descriptionAr,
      descriptionEn: notification.descriptionEn,
      type: notification.type,
      recipients: notification.recipients,
      language: notification.language,
    });
    setOpenDialog(true);
  };

  const handleSendNotification = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: 'sent', sentAt: new Date() }
          : notification
      )
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== notificationId)
    );
  };

  const customRender = useMemo(
    () => ({
      titleAr: (row: DashboardNotification) => <span>{row.titleAr}</span>,
      type: (row: DashboardNotification) => {
        const label = NOTIFICATION_TYPE_OPTIONS.find((o) => o.value === row.type)?.label;
        return <span>{label}</span>;
      },
      status: (row: DashboardNotification) => {
        const label = NOTIFICATION_STATUS_OPTIONS.find((o) => o.value === row.status)?.label;
        const cls = STATUS_BADGE_CLASSES[row.status] || '';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
          >
            {label}
          </span>
        );
      },
      recipientCount: (row: DashboardNotification) => (
        <span>{row.recipientCount.toLocaleString()}</span>
      ),
      successRate: (row: DashboardNotification) => (
        <span>
          {row.status === 'sent'
            ? `${((row.successCount / row.recipientCount) * 100).toFixed(1)}%`
            : '-'}
        </span>
      ),
      createdAt: (row: DashboardNotification) => (
        <span>{new Date(row.createdAt).toLocaleDateString('ar-SA')}</span>
      ),
    }),
    []
  );

  const actions = useMemo(
    () => [
      {
        label: 'عرض' as any,
        icon: <Iconify icon="solar:eye-bold" />,
        onClick: (row: DashboardNotification) => handleViewNotification(row),
      },
      {
        label: 'تعديل' as any,
        icon: <Iconify icon="solar:pen-bold" />,
        onClick: (row: DashboardNotification) => handleEditNotification(row),
      },
      {
        label: 'إرسال' as any,
        icon: <Iconify icon="solar:plain-bold" />,
        onClick: (row: DashboardNotification) => handleSendNotification(row.id),
        hide: (row: DashboardNotification) => row.status !== 'draft',
      },
      {
        label: 'حذف' as any,
        icon: <Iconify icon="solar:trash-bin-trash-bold" />,
        onClick: (row: DashboardNotification) => handleDeleteNotification(row.id),
        sx: { color: 'error.main' },
      },
    ],
    []
  );

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-5">
          <p className="text-sm text-grey-600 dark:text-grey-400 mb-1">
            {t('Pages.Notification.total')}
          </p>
          <p className="text-2xl font-bold text-[#263238] dark:text-white">
            {notifications.length}
          </p>
        </div>

        <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-5">
          <p className="text-sm text-grey-600 dark:text-grey-400 mb-1">
            {t('Pages.Notification.sent_count')}
          </p>
          <p className="text-2xl font-bold text-success-dark dark:text-success-light">
            {sentCount}
          </p>
        </div>

        <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-5">
          <p className="text-sm text-grey-600 dark:text-grey-400 mb-1">
            {t('Pages.Notification.scheduled_count')}
          </p>
          <p className="text-2xl font-bold text-warning-dark dark:text-warning-light">
            {scheduledCount}
          </p>
        </div>

        <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-5">
          <p className="text-sm text-grey-600 dark:text-grey-400 mb-1">
            {t('Pages.Notification.drafts_count')}
          </p>
          <p className="text-2xl font-bold text-grey-600 dark:text-grey-400">{draftCount}</p>
        </div>
      </div>

      {/* Notifications Table Card */}
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
          <div>
            <h2 className="text-base font-bold text-[#263238] dark:text-white">
              {t('Pages.Notification.admin_title')}
            </h2>
            <p className="mt-0.5 text-sm text-grey-600 dark:text-grey-400">
              {t('Pages.Notification.admin_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-grey-500 dark:text-grey-400">
                <Iconify icon="mdi:magnify" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder={t('Pages.Notification.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-10 pe-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <button
              onClick={handleOpenDialog}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-bold shadow-sm transition-colors"
            >
              <Iconify icon="mdi:plus" className="w-4 h-4" />
              {t('Pages.Notification.new_notification')}
            </button>
          </div>
        </div>

        <SharedTable<DashboardNotification>
          tableHead={TABLE_HEAD}
          data={filteredNotifications}
          count={filteredNotifications.length}
          customRender={customRender}
          actions={actions}
        />
      </div>

      {/* Create/Edit Notification Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-solid border-grey-200 dark:border-grey-700">
              <h3 className="text-base font-bold text-[#263238] dark:text-white">
                {selectedNotif
                  ? t('Pages.Notification.edit_title')
                  : t('Pages.Notification.create_title')}
              </h3>
              <button
                onClick={handleCloseDialog}
                className="p-1.5 rounded-full hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-500 dark:text-grey-400 transition-colors"
              >
                <Iconify icon="eva:close-fill" className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                  {t('Pages.Notification.title_ar_label')}
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                  {t('Pages.Notification.title_en_label')}
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                  {t('Pages.Notification.description_ar_label')}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                  {t('Pages.Notification.description_en_label')}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                  {t('Pages.Notification.type_label')}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  {NOTIFICATION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                  {t('Pages.Notification.recipients_label')}
                </label>
                <select
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  {NOTIFICATION_RECIPIENTS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-grey-200 dark:border-grey-700">
              <button
                onClick={handleCloseDialog}
                className="px-5 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 text-sm font-medium text-grey-700 dark:text-grey-300 hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors"
              >
                {t('Pages.Notification.cancel')}
              </button>
              <button
                onClick={handleCreateNotification}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-bold shadow-sm transition-colors"
              >
                {selectedNotif ? t('Pages.Notification.save') : t('Pages.Notification.create_btn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
