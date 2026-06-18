import { _mock } from './_mock';

// Commission types
export const COMMISSION_TYPE_OPTIONS = [
  { value: 'percentage', label: 'نسبة مئوية %' },
  { value: 'fixed', label: 'مبلغ ثابت' },
];

// Commission status
export const COMMISSION_STATUS_OPTIONS = [
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
  { value: 'pending', label: 'قيد الانتظار' },
];

// Commissions list
export const _commissionsList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: [
    'عمولة الدفع الآلي',
    'عمولة المحفظة الرقمية',
    'عمولة التحويل البنكي',
    'عمولة الدفع عند الاستلام',
  ][index % 4],
  type: COMMISSION_TYPE_OPTIONS[index % 2].value,
  rate: index % 2 === 0 ? (2 + Math.random() * 5).toFixed(2) : (10 + Math.random() * 40).toFixed(0),
  minAmount: index * 100,
  maxAmount: index * 1000 + 5000,
  status: COMMISSION_STATUS_OPTIONS[index % 3].value,
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
  totalTransactions: _mock.number.nativeL(index),
  totalAmount: _mock.number.price(index),
  totalCommission: _mock.number.price(index),
}));

// Commission details
export const _commissionDetail = (id: string) => {
  const index = parseInt(id) || 0;
  return {
    id: _mock.id(index),
    name: 'عمولة الدفع الآلي',
    type: 'percentage',
    rate: '3.5',
    minAmount: 0,
    maxAmount: 10000000,
    status: 'active',
    createdAt: _mock.time(index),
    updatedAt: _mock.time(index),
    createdBy: _mock.fullName(0),
    updatedBy: _mock.fullName(1),
    description: 'عمولة تطبق على جميع المعاملات المالية للدفع الآلي',
    totalTransactions: 15420,
    totalAmount: 2500000,
    totalCommission: 87500,
    monthlyBreakdown: [
      { month: 'يناير', transactions: 1200, amount: 180000, commission: 6300 },
      { month: 'فبراير', transactions: 1450, amount: 210000, commission: 7350 },
      { month: 'مارس', transactions: 1320, amount: 195000, commission: 6825 },
    ],
  };
};
