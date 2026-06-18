import { _mock } from './_mock';

// Financial status
export const FINANCIAL_STATUS_OPTIONS = [
  { value: 'completed', label: 'مكتمل' },
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'disputed', label: 'متنازع عليه' },
];

// Financial reports summary
export const _financialSummary = {
  totalRevenue: 2450000,
  totalExpenses: 650000,
  totalCommissions: 87500,
  netProfit: 1712500,
  profitMargin: 69.9,
  paymentMethodBreakdown: [
    { method: 'بطاقة ائتمان', amount: 1200000, percentage: 49 },
    { method: 'محفظة رقمية', amount: 800000, percentage: 33 },
    { method: 'تحويل بنكي', amount: 450000, percentage: 18 },
  ],
};

// Monthly financial data
export const _monthlyFinancialData = [...Array(12)].map((_, index) => ({
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
  revenue: 150000 + Math.random() * 300000,
  expenses: 50000 + Math.random() * 100000,
  commissions: 5000 + Math.random() * 15000,
  profit: 80000 + Math.random() * 200000,
}));

// Financial reports list
export const _financialReports = [...Array(15)].map((_, index) => ({
  id: _mock.id(index),
  title: ['تقرير الإيرادات', 'تقرير المصروفات', 'تقرير الأرباح', 'تقرير العمولات', 'تقرير الضرائب'][
    index % 5
  ],
  period: ['يناير 2024', 'فبراير 2024', 'مارس 2024', 'Q1 2024'][index % 4],
  revenue: 150000 + Math.random() * 300000,
  expenses: 50000 + Math.random() * 100000,
  commissions: 5000 + Math.random() * 15000,
  profit: 80000 + Math.random() * 200000,
  profitMargin: (50 + Math.random() * 30).toFixed(1),
  generatedAt: _mock.time(index),
  status: FINANCIAL_STATUS_OPTIONS[index % 3].value,
}));

// Expense categories
export const _expenseCategories = [
  { category: 'رسوم البنك', amount: 150000, percentage: 23 },
  { category: 'تكاليف التشغيل', amount: 200000, percentage: 31 },
  { category: 'تكاليف التسويق', amount: 150000, percentage: 23 },
  { category: 'رسوم المنصات', amount: 100000, percentage: 15 },
  { category: 'أخرى', amount: 50000, percentage: 8 },
];

// Profit breakdown
export const _profitBreakdown = [
  { source: 'بيع المنتجات', amount: 1800000, percentage: 73 },
  { source: 'الخدمات الإضافية', amount: 500000, percentage: 20 },
  { source: 'العمولات والرسوم', amount: 150000, percentage: 7 },
];

// Financial details
export const _financialDetail = (id: string) => {
  const index = parseInt(id) || 0;
  return {
    id: _mock.id(index),
    title: 'تقرير الإيرادات والأرباح - يناير 2024',
    period: 'يناير 2024',
    generatedAt: _mock.time(index),
    generatedBy: _mock.fullName(0),
    revenue: 250000,
    expenses: 75000,
    commissions: 8750,
    profit: 166250,
    profitMargin: 66.5,
    paymentMethods: [
      { method: 'بطاقة ائتمان', amount: 120000, transactions: 450 },
      { method: 'محفظة رقمية', amount: 100000, transactions: 600 },
      { method: 'تحويل بنكي', amount: 30000, transactions: 80 },
    ],
    expensesBreakdown: [
      { category: 'رسوم البنك', amount: 25000 },
      { category: 'تكاليف التشغيل', amount: 30000 },
      { category: 'تكاليف التسويق', amount: 20000 },
    ],
    topProducts: [
      { name: 'منتج A', revenue: 80000 },
      { name: 'منتج B', revenue: 65000 },
      { name: 'منتج C', revenue: 55000 },
    ],
  };
};
