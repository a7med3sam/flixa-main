import { _mock } from './_mock';

// Notification status
export const NOTIFICATION_STATUS_OPTIONS = [
  { value: 'draft', label: 'مسودة' },
  { value: 'scheduled', label: 'مجدول' },
  { value: 'sent', label: 'مرسل' },
  { value: 'failed', label: 'فشل' },
];

// Notification type
export const NOTIFICATION_TYPE_OPTIONS = [
  { value: 'announcement', label: 'إعلان عام' },
  { value: 'promotion', label: 'عرض ترويجي' },
  { value: 'warning', label: 'تنبيه' },
  { value: 'update', label: 'تحديث' },
];

// Notification recipients
export const NOTIFICATION_RECIPIENTS_OPTIONS = [
  { value: 'all', label: 'جميع المستخدمين' },
  { value: 'active', label: 'المستخدمين النشطين' },
  { value: 'inactive', label: 'المستخدمين غير النشطين' },
  { value: 'specific', label: 'مستخدمين محددين' },
];

// Notifications list
export const _notificationsList = [...Array(15)].map((_, index) => ({
  id: _mock.id(index),
  titleAr: ['عرض خاص يصل 50%', 'تحديث تطبيق جديد', 'شكراً على تعاملك معنا', 'عطل مؤقت في الخدمة'][
    index % 4
  ],
  titleEn: [
    'Special offer up to 50%',
    'New app update',
    'Thank you for your business',
    'Temporary service disruption',
  ][index % 4],
  descriptionAr: 'وصف الإشعار باللغة العربية...',
  descriptionEn: 'Notification description in English...',
  type: NOTIFICATION_TYPE_OPTIONS[index % 4].value,
  status: NOTIFICATION_STATUS_OPTIONS[index % 4].value,
  recipients: NOTIFICATION_RECIPIENTS_OPTIONS[0].value,
  recipientCount: 15000 + Math.random() * 5000,
  successCount: 12000 + Math.random() * 5000,
  failureCount: Math.floor(Math.random() * 1000),
  language: index % 2 === 0 ? 'both' : index % 3 === 0 ? 'ar' : 'en',
  createdAt: _mock.time(index),
  createdBy: _mock.fullName(index),
  sentAt: index > 5 ? _mock.time(index) : null,
}));

// Notification detail
export const _notificationDetail = (id: string) => {
  const index = parseInt(id) || 0;
  return {
    id,
    titleAr: 'عرض خاص يصل 50% على جميع المنتجات',
    titleEn: 'Special offer up to 50% on all products',
    descriptionAr: 'استمتع بأفضل العروض الترويجية لفترة محدودة',
    descriptionEn: 'Enjoy the best promotional offers for a limited time',
    type: 'promotion',
    status: 'sent',
    recipients: 'all',
    recipientCount: 18000,
    successCount: 16500,
    failureCount: 150,
    language: 'both',
    createdAt: _mock.time(index),
    createdBy: _mock.fullName(0),
    sentAt: _mock.time(index),
    imageUrl: _mock.image.cover(index),
    actionLink: '/app/promotions/special-offer',
    actionLinkText: 'عرض العرض',
    scheduleType: 'immediate',
    targetAudience: {
      specific: [],
      criteria: [],
    },
    analytics: {
      impressions: 16500,
      clicks: 2450,
      conversionRate: 14.8,
    },
  };
};

// Notification templates
export const _notificationTemplates = [
  {
    id: '1',
    name: 'قالب العرض الترويجي',
    type: 'promotion',
    language: 'ar',
    content: 'استمتع بعرض خاص: {{discountPercent}}% على {{productCategory}}',
  },
  {
    id: '2',
    name: 'قالب التحديث',
    type: 'update',
    language: 'ar',
    content: 'تم إطلاق تحديث جديد للتطبيق مع {{features}}',
  },
];
