'use client';

import { useMemo, useState } from 'react';
import Iconify from 'src/components/iconify';
import { ICONS } from 'src/config-icons';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { USER_STATUS_OPTIONS, _dashboardUsers } from 'src/_mock/_dashboard-users';

type DashboardUser = (typeof _dashboardUsers)[number];

const TABLE_HEAD = [
  { id: 'name', label: 'Global.Label.name' },
  { id: 'email', label: 'Global.Label.email' },
  { id: 'phone', label: 'Global.Label.phone' },
  { id: 'status', label: 'Global.Label.status' },
  { id: 'totalOrders', label: 'Pages.Home.total_orders' },
  { id: 'totalSpent', label: 'Pages.Home.total_spent' },
];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  active:
    'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30',
  inactive:
    'bg-grey-100 dark:bg-grey-800 text-grey-600 dark:text-grey-400 border border-solid border-grey-300 dark:border-grey-700',
  suspended:
    'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30',
  blocked: 'bg-error/10 text-error-dark dark:text-error-light border border-solid border-error/30',
};

export default function UsersListView() {
  const [users, setUsers] = useState(_dashboardUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    const newUser: DashboardUser = {
      ..._dashboardUsers[0],
      id: Date.now().toString(),
      name: 'مستخدم جديد',
      email: `new-user-${Date.now()}@example.com`,
      phone: '0500000000',
      status: 'active',
      totalOrders: 0,
      totalSpent: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleEditUser = (user: DashboardUser) => {
    setSelectedUser(user);
    setNewStatus(user.status);
    setOpenDialog(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u))
      );
    }
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const customRender = useMemo(
    () => ({
      status: (user: DashboardUser) => {
        const label = USER_STATUS_OPTIONS.find((o) => o.value === user.status)?.label;
        const cls = STATUS_BADGE_CLASSES[user.status] ?? STATUS_BADGE_CLASSES.inactive;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
          >
            {label}
          </span>
        );
      },
      totalSpent: (user: DashboardUser) => (
        <span>{(user.totalSpent ?? 0).toLocaleString()} ريال</span>
      ),
    }),
    []
  );

  const actions = useMemo(
    () => [
      {
        label: 'إضافة' as any,
        icon: <Iconify icon="solar:add-circle-bold" />,
        onClick: () => handleAddUser(),
      },
      {
        label: 'تعديل' as any,
        icon: <Iconify icon="solar:pen-bold" />,
        onClick: (user: DashboardUser) => handleEditUser(user),
      },
      {
        label: 'حذف' as any,
        icon: <Iconify icon="solar:trash-bin-trash-bold" />,
        onClick: (user: DashboardUser) => handleDeleteUser(user.id),
        sx: { color: 'error.main' },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="p-6">
      {/* Card */}
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
          <div>
            <h2 className="text-base font-bold text-[#263238] dark:text-white">إدارة المستخدمين</h2>
            <p className="mt-0.5 text-sm text-grey-600 dark:text-grey-400">
              إدارة حسابات المستخدمين وتفعيلها أو تعطيلها
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-grey-500 dark:text-grey-400">
              <Iconify icon="mdi:magnify" className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="البحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-10 pe-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        {/* Table */}
        <SharedTable<DashboardUser>
          tableHead={TABLE_HEAD}
          data={filteredUsers}
          count={filteredUsers.length}
          customRender={customRender}
          actions={actions}
        />
      </div>

      {/* Edit Status Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-xl w-full max-w-md">
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-solid border-grey-200 dark:border-grey-700">
              <h3 className="text-base font-bold text-[#263238] dark:text-white">
                تغيير حالة المستخدم
              </h3>
              <button
                onClick={() => setOpenDialog(false)}
                className="p-1.5 rounded-full hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-500 dark:text-grey-400 transition-colors"
              >
                <Iconify icon="eva:close-fill" className="w-5 h-5" />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="px-6 py-5">
              <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                الحالة الجديدة
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                {USER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-grey-200 dark:border-grey-700">
              <button
                onClick={() => setOpenDialog(false)}
                className="px-5 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 text-sm font-medium text-grey-700 dark:text-grey-300 hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-bold shadow-sm transition-colors"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
