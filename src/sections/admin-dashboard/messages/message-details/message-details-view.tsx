// 'use client';

// import { useRouter } from 'next/navigation';
// import { useTranslations } from 'next-intl';
// import { useSnackbar } from 'notistack';
// import { useCallback, useEffect, useState } from 'react';
// import axios from 'src/utils/axios';
// import { endpoints } from 'src/utils/endpoints';
// import Iconify from 'src/components/iconify';
// import { format } from 'date-fns';
// import { arSA } from 'date-fns/locale';

// // ----------------------------------------------------------------------

// interface MessageDetails {
//     id: string;
//     status: string;
//     name: string;
//     email: string;
//     message: string;
//     closedAt: string | null;
//     creationTime: string;
// }

// interface MessageDetailsViewProps {
//     messageId: string;
// }

// // ----------------------------------------------------------------------

// const STATUS_BADGE_CLASSES: Record<string, string> = {
//     Open: 'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30',
//     Closed: 'bg-error/10 text-error-dark dark:text-error-light border border-solid border-error/30',
//     'In Progress': 'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30',
// };

// const STATUS_ICONS: Record<string, string> = {
//     Open: 'mdi:email-open',
//     Closed: 'mdi:archive',
//     'In Progress': 'mdi:clock-outline',
// };

// // ----------------------------------------------------------------------

// export default function MessageDetailsView({ messageId }: MessageDetailsViewProps) {
//     const router = useRouter();
//     const { enqueueSnackbar } = useSnackbar();
//     const t = useTranslations();

//     const [messageDetails, setMessageDetails] = useState<MessageDetails | null>(null);
//     const [loading, setLoading] = useState(true);

//     // ──────────────────────────────────────────────
//     // Fetch message details from API
//     // ──────────────────────────────────────────────
//     const fetchMessageDetails = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get<MessageDetails>(endpoints.message.single(messageId));
//             setMessageDetails(res.data);
//         } catch (err: any) {
//             enqueueSnackbar(err?.message || 'Failed to load message details', { variant: 'error' });
//         } finally {
//             setLoading(false);
//         }
//     }, [messageId, enqueueSnackbar]);

//     useEffect(() => {
//         if (messageId) {
//             fetchMessageDetails();
//         }
//     }, [messageId, fetchMessageDetails]);

//     // ──────────────────────────────────────────────
//     // Loading state
//     // ──────────────────────────────────────────────
//     if (loading) {
//         return (
//             <div className="p-6 flex items-center justify-center min-h-[400px]">
//                 <div className="flex flex-col items-center gap-4">
//                     <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//                     <p className="text-grey-500 dark:text-grey-400">
//                         {t('Global.Loading.loading') || 'Loading...'}
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // ──────────────────────────────────────────────
//     // Empty/Not Found state
//     // ──────────────────────────────────────────────
//     if (!messageDetails) {
//         return (
//             <div className="p-6 flex items-center justify-center min-h-[400px]">
//                 <div className="flex flex-col items-center gap-4">
//                     <Iconify icon="mdi:alert-circle-outline" className="w-16 h-16 text-grey-300 dark:text-grey-600" />
//                     <p className="text-grey-500 dark:text-grey-400">
//                         {t('Pages.Messages.message_not_found') || 'Message not found'}
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // ──────────────────────────────────────────────
//     // Format date helper
//     // ──────────────────────────────────────────────
//     const formatDate = (date: string | null) => {
//         if (!date) return '—';
//         try {
//             return format(new Date(date), 'dd MMMM yyyy, h:mm a', { locale: arSA });
//         } catch {
//             return date;
//         }
//     };

//     // ──────────────────────────────────────────────
//     // Handlers
//     // ──────────────────────────────────────────────
//     const handleReply = () => {
//         enqueueSnackbar(t('Pages.Messages.reply_to', { name: messageDetails.name }), { variant: 'info' });
//     };

//     const handleBack = () => {
//         router.back();
//     };

//     const statusClass = STATUS_BADGE_CLASSES[messageDetails.status] || STATUS_BADGE_CLASSES.Open;
//     const statusIcon = STATUS_ICONS[messageDetails.status] || STATUS_ICONS.Open;

//     // ──────────────────────────────────────────────
//     // Render
//     // ──────────────────────────────────────────────
//     return (
//         <div className="p-6 max-w-5xl mx-auto">
//             {/* Back Button */}
//             <button
//                 onClick={handleBack}
//                 className="flex items-center gap-2 text-grey-600 dark:text-grey-400 hover:text-grey-900 dark:hover:text-white transition-colors mb-6 group"
//             >
//                 <Iconify icon="mdi:arrow-right" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//                 <span className="text-sm font-medium">{t('Global.Action.back') || 'رجوع'}</span>
//             </button>

//             {/* Main Card */}
//             <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
//                 {/* Header */}
//                 <div className="px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
//                     <div className="flex flex-wrap items-start justify-between gap-4">
//                         <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-3 flex-wrap">
//                                 <h1 className="text-xl font-bold text-[#263238] dark:text-white truncate">
//                                     {messageDetails.name}
//                                 </h1>
//                                 <span
//                                     className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
//                                 >
//                                     <Iconify icon={statusIcon} className="w-3.5 h-3.5" />
//                                     {messageDetails.status}
//                                 </span>
//                             </div>
//                             <p className="mt-1 text-sm text-grey-500 dark:text-grey-400">
//                                 {t('Pages.Messages.received_at') || 'Received at'}: {formatDate(messageDetails.creationTime)}
//                             </p>
//                         </div>

//                         {/* Actions */}
//                         <div className="flex items-center gap-2 shrink-0">
//                             <button
//                                 onClick={handleReply}
//                                 className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-sm transition-colors"
//                             >
//                                 <Iconify icon="mdi:reply" className="w-4 h-4" />
//                                 {t('Pages.Messages.reply')}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Body */}
//                 <div className="px-6 py-6 space-y-6">
//                     {/* Sender Info */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-grey-50 dark:bg-grey-800/50 rounded-xl">
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
//                                 <Iconify icon="mdi:account" className="w-5 h-5 text-primary" />
//                             </div>
//                             <div>
//                                 <p className="text-xs text-grey-500 dark:text-grey-400">
//                                     {t('Pages.Messages.sender_name') || 'Sender'}
//                                 </p>
//                                 <p className="text-sm font-semibold text-[#263238] dark:text-white">
//                                     {messageDetails.name}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
//                                 <Iconify icon="mdi:email" className="w-5 h-5 text-primary" />
//                             </div>
//                             <div>
//                                 <p className="text-xs text-grey-500 dark:text-grey-400">
//                                     {t('Global.Label.email') || 'Email'}
//                                 </p>
//                                 <a
//                                     href={`mailto:${messageDetails.email}`}
//                                     className="text-sm font-semibold text-primary hover:underline truncate"
//                                 >
//                                     {messageDetails.email}
//                                 </a>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Message Content */}
//                     <div className="space-y-2">
//                         <h3 className="text-sm font-semibold text-[#263238] dark:text-white">
//                             {t('Pages.Messages.message_content') || 'Message Content'}
//                         </h3>
//                         <div className="p-4 bg-grey-50 dark:bg-grey-800/50 rounded-xl min-h-[120px]">
//                             <p className="text-sm text-grey-700 dark:text-grey-300 leading-relaxed whitespace-pre-wrap">
//                                 {messageDetails.message || '—'}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Additional Info */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
//                         <div className="flex items-center gap-2 text-sm">
//                             <span className="text-grey-500 dark:text-grey-400">
//                                 {t('Pages.Messages.ticket_id') || 'Ticket ID'}:
//                             </span>
//                             <span className="font-mono text-xs text-grey-700 dark:text-grey-300 bg-grey-100 dark:bg-grey-800 px-2 py-1 rounded">
//                                 {messageDetails.id}
//                             </span>
//                         </div>
//                         {messageDetails.closedAt && (
//                             <div className="flex items-center gap-2 text-sm">
//                                 <span className="text-grey-500 dark:text-grey-400">
//                                     {t('Pages.Messages.closed_at') || 'Closed at'}:
//                                 </span>
//                                 <span className="text-grey-700 dark:text-grey-300">
//                                     {formatDate(messageDetails.closedAt)}
//                                 </span>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

// ----------------------------------------------------------------------

interface MessageDetails {
    id: string;
    status: string;
    name: string;
    email: string;
    message: string;
    closedAt: string | null;
    creationTime: string;
}

interface MessageDetailsViewProps {
    messageId: string;
}

// ----------------------------------------------------------------------

const STATUS_BADGE_CLASSES: Record<string, string> = {
    Open: 'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30',
    Closed: 'bg-error/10 text-error-dark dark:text-error-light border border-solid border-error/30',
    'In Progress': 'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30',
};

const STATUS_ICONS: Record<string, string> = {
    Open: 'mdi:email-open',
    Closed: 'mdi:archive',
    'In Progress': 'mdi:clock-outline',
};

const STATUS_OPTIONS = [
    { value: 'Open', label: 'مفتوح', color: 'text-success' },
    { value: 'InProgress', label: 'قيد المعالجة', color: 'text-warning' },
    { value: 'Closed', label: 'مغلق', color: 'text-error' },
];

// ----------------------------------------------------------------------

export default function MessageDetailsView({ messageId }: MessageDetailsViewProps) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const t = useTranslations();

    const [messageDetails, setMessageDetails] = useState<MessageDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    // ──────────────────────────────────────────────
    // Fetch message details from API
    // ──────────────────────────────────────────────
    const fetchMessageDetails = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get<MessageDetails>(endpoints.message.single(messageId));
            setMessageDetails(res.data);
            setSelectedStatus(res.data.status);
        } catch (err: any) {
            enqueueSnackbar(err?.message || 'Failed to load message details', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [messageId, enqueueSnackbar]);

    useEffect(() => {
        if (messageId) {
            fetchMessageDetails();
        }
    }, [messageId, fetchMessageDetails]);

    // ──────────────────────────────────────────────
    // Update status
    // ──────────────────────────────────────────────
    const handleUpdateStatus = async () => {
        if (!selectedStatus || selectedStatus === messageDetails?.status) {
            setOpenDialog(false);
            return;
        }

        setUpdating(true);
        try {
            await axios.put(
                endpoints.message.patch(messageId),
                null,
                {
                    params: { status: selectedStatus }
                }
            );

            // Update local state
            setMessageDetails((prev) =>
                prev ? { ...prev, status: selectedStatus } : null
            );

            enqueueSnackbar('تم تحديث حالة التذكرة بنجاح', { variant: 'success' });
            setOpenDialog(false);
        } catch (err: any) {
            enqueueSnackbar(err?.message || 'Failed to update status', { variant: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    // ──────────────────────────────────────────────
    // Format date helper
    // ──────────────────────────────────────────────
    const formatDate = (date: string | null) => {
        if (!date) return '—';
        try {
            return format(new Date(date), 'dd MMMM yyyy, h:mm a', { locale: arSA });
        } catch {
            return date;
        }
    };

    // ──────────────────────────────────────────────
    // Handlers
    // ──────────────────────────────────────────────
    const handleReply = () => {
        enqueueSnackbar(t('Pages.Messages.reply_to', { name: messageDetails?.name }), { variant: 'info' });
    };

    const handleBack = () => {
        router.back();
    };

    const handleOpenDialog = () => {
        if (messageDetails) {
            setSelectedStatus(messageDetails.status);
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        if (!updating) {
            setOpenDialog(false);
        }
    };

    // ──────────────────────────────────────────────
    // Loading state
    // ──────────────────────────────────────────────
    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-grey-500 dark:text-grey-400">
                        {t('Global.Loading.loading') || 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    // ──────────────────────────────────────────────
    // Empty/Not Found state
    // ──────────────────────────────────────────────
    if (!messageDetails) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Iconify icon="mdi:alert-circle-outline" className="w-16 h-16 text-grey-300 dark:text-grey-600" />
                    <p className="text-grey-500 dark:text-grey-400">
                        {t('Pages.Messages.message_not_found') || 'Message not found'}
                    </p>
                </div>
            </div>
        );
    }

    const statusClass = STATUS_BADGE_CLASSES[messageDetails.status] || STATUS_BADGE_CLASSES.Open;
    const statusIcon = STATUS_ICONS[messageDetails.status] || STATUS_ICONS.Open;

    // ──────────────────────────────────────────────
    // Render
    // ──────────────────────────────────────────────
    return (
        <>
            <div className="p-6 max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-grey-600 dark:text-grey-400 hover:text-grey-900 dark:hover:text-white transition-colors mb-6 group"
                >
                    <Iconify icon="mdi:arrow-right" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">{t('Global.Action.back') || 'رجوع'}</span>
                </button>

                {/* Main Card */}
                <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-xl font-bold text-[#263238] dark:text-white truncate">
                                        {messageDetails.name}
                                    </h1>
                                    <button
                                        onClick={handleOpenDialog}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusClass} hover:opacity-80 transition-opacity cursor-pointer`}
                                    >
                                        <Iconify icon={statusIcon} className="w-3.5 h-3.5" />
                                        {messageDetails.status}
                                        <Iconify icon="mdi:pencil" className="w-3 h-3" />
                                    </button>
                                </div>
                                <p className="mt-1 text-sm text-grey-500 dark:text-grey-400">
                                    {t('Pages.Messages.received_at') || 'Received at'}: {formatDate(messageDetails.creationTime)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={handleReply}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-sm transition-colors"
                                >
                                    <Iconify icon="mdi:reply" className="w-4 h-4" />
                                    {t('Pages.Messages.reply')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6 space-y-6">
                        {/* Sender Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-grey-50 dark:bg-grey-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Iconify icon="mdi:account" className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-grey-500 dark:text-grey-400">
                                        {t('Pages.Messages.sender_name') || 'Sender'}
                                    </p>
                                    <p className="text-sm font-semibold text-[#263238] dark:text-white">
                                        {messageDetails.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Iconify icon="mdi:email" className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-grey-500 dark:text-grey-400">
                                        {t('Global.Label.email') || 'Email'}
                                    </p>
                                    <a
                                        href={`mailto:${messageDetails.email}`}
                                        className="text-sm font-semibold text-primary hover:underline truncate"
                                    >
                                        {messageDetails.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-[#263238] dark:text-white">
                                {t('Pages.Messages.message_content') || 'Message Content'}
                            </h3>
                            <div className="p-4 bg-grey-50 dark:bg-grey-800/50 rounded-xl min-h-[120px]">
                                <p className="text-sm text-grey-700 dark:text-grey-300 leading-relaxed whitespace-pre-wrap">
                                    {messageDetails.message || '—'}
                                </p>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-grey-500 dark:text-grey-400">
                                    {t('Pages.Messages.ticket_id') || 'Ticket ID'}:
                                </span>
                                <span className="font-mono text-xs text-grey-700 dark:text-grey-300 bg-grey-100 dark:bg-grey-800 px-2 py-1 rounded">
                                    {messageDetails.id}
                                </span>
                            </div>
                            {messageDetails.closedAt && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-grey-500 dark:text-grey-400">
                                        {t('Pages.Messages.closed_at') || 'Closed at'}:
                                    </span>
                                    <span className="text-grey-700 dark:text-grey-300">
                                        {formatDate(messageDetails.closedAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Status Edit Dialog ── */}
            {openDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        {/* Dialog Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-solid border-grey-200 dark:border-grey-700">
                            <h2 className="text-lg font-bold text-[#263238] dark:text-white">
                                {t('Pages.Messages.change_status') || 'تغيير الحالة'}
                            </h2>
                            <button
                                onClick={handleCloseDialog}
                                disabled={updating}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors disabled:opacity-50"
                            >
                                <Iconify icon="mdi:close" className="w-5 h-5 text-grey-500" />
                            </button>
                        </div>

                        {/* Dialog Body */}
                        <div className="px-6 py-6">
                            <p className="text-sm text-grey-600 dark:text-grey-400 mb-4">
                                {t('Pages.Messages.select_status') || 'اختر الحالة الجديدة للتذكرة'}
                            </p>

                            <div className="space-y-3">
                                {STATUS_OPTIONS.map((option) => {
                                    const isSelected = selectedStatus === option.value;
                                    const isCurrent = messageDetails?.status === option.value;
                                    const icon = STATUS_ICONS[option.value] || 'mdi:circle-outline';

                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => setSelectedStatus(option.value)}
                                            disabled={updating}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-grey-200 dark:border-grey-700 hover:border-grey-300 dark:hover:border-grey-600'
                                                } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary/10' : 'bg-grey-100 dark:bg-grey-800'
                                                }`}>
                                                <Iconify
                                                    icon={icon}
                                                    className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-grey-400'
                                                        }`}
                                                />
                                            </div>
                                            <div className="flex-1 text-right">
                                                <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-grey-700 dark:text-grey-300'
                                                    }`}>
                                                    {option.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-grey-400">
                                                        {t('Pages.Messages.current_status') || 'الحالة الحالية'}
                                                    </p>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <Iconify
                                                    icon="mdi:check-circle"
                                                    className="w-6 h-6 text-primary"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dialog Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-solid border-grey-200 dark:border-grey-700">
                            <button
                                onClick={handleCloseDialog}
                                disabled={updating}
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-grey-600 dark:text-grey-400 hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors disabled:opacity-50"
                            >
                                {t('Global.Action.cancel') || 'إلغاء'}
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={updating || selectedStatus === messageDetails?.status}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {t('Global.Loading.updating') || 'جاري التحديث...'}
                                    </>
                                ) : (
                                    <>
                                        <Iconify icon="mdi:check" className="w-4 h-4" />
                                        {t('Global.Action.save') || 'حفظ'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}