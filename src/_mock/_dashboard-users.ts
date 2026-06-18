import { _mock } from './_mock';

// User status options
export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'نشط', icon: 'mdi:check-circle' },
  { value: 'inactive', label: 'غير نشط', icon: 'mdi:close-circle' },
  { value: 'suspended', label: 'معلق', icon: 'mdi:pause-circle' },
  { value: 'blocked', label: 'محظور', icon: 'mdi:cancel' },
];

// Dashboard Users (App Users Management)
export const _dashboardUsers = [...Array(25)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  email: _mock.email(index),
  phone: _mock.phoneNumber(index),
  avatarUrl: _mock.image.avatar(index),
  status: USER_STATUS_OPTIONS[index % 4].value,
  joinDate: _mock.time(index),
  totalOrders: _mock.number.nativeL(index),
  totalSpent: _mock.number.price(index),
  city: ['الرياض', 'جدة', 'الدمام', 'الطائف', 'مكة'][index % 5],
  isVerified: _mock.boolean(index),
  lastActive: _mock.time(index),
}));

// User details
export const _userDetail = (id: string) => {
  const index = parseInt(id) || 0;
  return {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    phone: _mock.phoneNumber(index),
    avatarUrl: _mock.image.avatar(index),
    status: USER_STATUS_OPTIONS[index % 4].value,
    joinDate: _mock.time(index),
    dateOfBirth: _mock.time(index),
    city: ['الرياض', 'جدة', 'الدمام'][index % 3],
    country: 'المملكة العربية السعودية',
    address: 'شارع النيل، حي السفارات',
    totalOrders: _mock.number.nativeL(index),
    totalSpent: _mock.number.price(index),
    totalReturns: Math.floor(Math.random() * 10),
    averageRating: (Math.random() * 5).toFixed(1),
    isVerified: _mock.boolean(index),
    lastActive: _mock.time(index),
    profileCompletion: 85 + Math.random() * 15,
  };
};
