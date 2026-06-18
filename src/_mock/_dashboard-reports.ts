import { _mock } from './_mock';

// Report types
export const REPORT_TYPE_OPTIONS = [
  { value: 'users', label: 'تقارير المستخدمين' },
  { value: 'transactions', label: 'تقارير العمليات' },
  { value: 'revenue', label: 'تقارير الإيرادات' },
  { value: 'orders', label: 'تقارير الطلبات' },
];

// Report period
export const REPORT_PERIOD_OPTIONS = [
  { value: 'daily', label: 'يومي' },
  { value: 'weekly', label: 'أسبوعي' },
  { value: 'monthly', label: 'شهري' },
  { value: 'yearly', label: 'سنوي' },
];

// Statistics Dashboard Data
export const _statisticsSummary = {
  totalUsers: 15420,
  activeUsers: 8950,
  newUsers: 245,
  totalOrders: 45230,
  completedOrders: 43200,
  pendingOrders: 1850,
  totalRevenue: 2450000,
  totalCommissions: 87500,
  averageOrderValue: 54200,
};

// User Activity Report
export const _userActivityReport = [...Array(12)].map((_, index) => ({
  month: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ][index],
  activeUsers: 5000 + Math.random() * 5000,
  newUsers: 200 + Math.random() * 500,
  inactiveUsers: 1000 + Math.random() * 2000,
}));

// Transaction Report
export const _transactionReport = [...Array(12)].map((_, index) => ({
  month: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ][index],
  completed: 3000 + Math.random() * 2000,
  failed: 100 + Math.random() * 300,
  pending: 50 + Math.random() * 150,
}));

// Order Status Report
export const _orderStatusReport = [
  { status: 'مكتمل', value: 43200, color: '#00B074' },
  { status: 'قيد الفحص', value: 1200, color: '#FFC107' },
  { status: 'قيد الشحن', value: 650, color: '#2196F3' },
  { status: 'ملغي', value: 180, color: '#F44336' },
];

// Recent Reports
export const _recentReports = [...Array(10)].map((_, index) => ({
  id: _mock.id(index),
  title: [
    'ملخص المستخدمين الجدد',
    'تقرير الإيرادات الأسبوعي',
    'تحليل أداء التطبيق',
    'تقرير الطلبات المرتجعة',
  ][index % 4],
  type: REPORT_TYPE_OPTIONS[index % 4].value,
  period: REPORT_PERIOD_OPTIONS[Math.floor(index / 2) % 4].value,
  createdAt: _mock.time(index),
  createdBy: _mock.fullName(index),
  downloadUrl: '#',
  status: index % 3 === 0 ? 'completed' : 'processing',
}));
