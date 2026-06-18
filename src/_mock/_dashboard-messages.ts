import { _mock } from './_mock';

// Message status
export const MESSAGE_STATUS_OPTIONS = [
  { value: 'new', label: 'جديد' },
  { value: 'read', label: 'مقروء' },
  { value: 'replied', label: 'تم الرد عليه' },
  { value: 'archived', label: 'مؤرشف' },
];

// Message priority
export const MESSAGE_PRIORITY_OPTIONS = [
  { value: 'low', label: 'منخفض' },
  { value: 'medium', label: 'متوسط' },
  { value: 'high', label: 'عالي' },
  { value: 'urgent', label: 'عاجل' },
];

// Messages list
export const _messagesList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  senderName: _mock.fullName(index),
  senderEmail: _mock.email(index),
  subject: ['مشكلة في الدفع', 'استفسار عن المنتج', 'شكوى عن الشحن', 'طلب استرجاع'][index % 4],
  message: 'رسالة قصيرة من المستخدم...',
  status: MESSAGE_STATUS_OPTIONS[index % 4].value,
  priority: MESSAGE_PRIORITY_OPTIONS[index % 4].value,
  receivedAt: _mock.time(index),
  category: ['عام', 'شكاوى', 'استفسارات', 'اقتراحات'][index % 4],
  isRead: index % 2 === 0,
}));

// Message detail
export const _messageDetail = (id: string) => {
  const index = parseInt(id) || 0;
  return {
    id,
    senderName: _mock.fullName(index),
    senderEmail: _mock.email(index),
    senderPhone: _mock.phoneNumber(index),
    subject: 'مشكلة في عملية الدفع',
    message: 'السلام عليكم، أواجه مشكلة في إكمال عملية الدفع. الرجاء المساعدة.',
    attachments: [{ id: '1', name: 'screenshot.jpg', size: '2.5 MB', url: '#' }],
    status: 'new',
    priority: 'high',
    category: 'شكاوى',
    receivedAt: _mock.time(index),
    isRead: false,
    replies: [
      {
        id: '1',
        senderName: 'محمد أحمد',
        senderRole: 'فريق الدعم',
        message: 'شكراً على تواصلك معنا. سنحقق في المشكلة فوراً.',
        sentAt: _mock.time(0),
      },
    ],
  };
};
