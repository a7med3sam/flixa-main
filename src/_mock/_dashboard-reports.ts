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
  totalUsers: 12480,
  activeUsers: 8950,
  newUsers: 245,
  totalOrders: 349000,
  completedOrders: 43200,
  pendingOrders: 1850,
  totalRevenue: 200,
  totalCommissions: 87500,
  averageOrderValue: 54200,
};

export const _reportsSummary = {
  totalSales: 184250,
  deliveryFees: 12840,
  valueAddedTax: 27637.5,
  discounts: 9450,
  netRevenue: 175800,
};

export const _reportPaymentMethods = [
  {
    id: 'cash',
    name: 'الدفع عند الاستلام',
    description: 'الدفع نقدا عند استلام الطلب',
    isActive: true,
    processingFee: 0,
    image: '',
  },
  {
    id: 'card',
    name: 'بطاقة بنكية',
    description: 'الدفع بواسطة بطاقة بنكية',
    isActive: true,
    processingFee: 2.5,
    image: '',
  },
  {
    id: 'wallet',
    name: 'المحفظة الرقمية',
    description: 'الدفع من رصيد المحفظة',
    isActive: true,
    processingFee: 1,
    image: '',
  },
];

export const _reportOrders = [...Array(18)].map((_, index) => {
  const orderAmount = 180 + index * 37;
  const vatAmount = Number((orderAmount * 0.15).toFixed(2));
  const shippingCost = [18, 22, 28, 35][index % 4];
  const discount = index % 3 === 0 ? 25 : index % 4 === 0 ? 15 : 0;

  return {
    id: _mock.id(index),
    orderNumber: `ORD-${String(2400 + index).padStart(5, '0')}`,
    creationTime: new Date(2026, 5, 18 - index, 10 + (index % 8), 15).toISOString(),
    paymentMethodName: _reportPaymentMethods[index % _reportPaymentMethods.length].name,
    totalOrderAmount: orderAmount,
    vatAmount,
    discount,
    shippingCost,
    totalPrice: Number((orderAmount + vatAmount + shippingCost - discount).toFixed(2)),
    isReturned: index % 5 === 0,
  };
});

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
