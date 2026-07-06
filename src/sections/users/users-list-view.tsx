'use client';

import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clients, CreateClientPayload, CustomersListResponse } from 'src/types/clients';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

const TABLE_HEAD = [
  { id: 'name', label: 'Global.Label.name' },
  { id: 'email', label: 'Global.Label.email' },
  { id: 'phoneNumber', label: 'Global.Label.phone' },
  { id: 'isActive', label: 'Global.Label.status' },
  { id: 'actions', label: 'Pages.Messages.actions' },
];

// ────────────────────────────────────────────────────────────
// Small Tailwind-only replacements for the MUI primitives
// ────────────────────────────────────────────────────────────

function Spinner({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      dir="ltr"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-3 w-5 shrink-0 items-center rounded-full border-0 outline-none focus:outline-none transition-colors duration-200 ${
        checked ? 'bg-[#2ecc71]' : 'bg-[#c4ccd4]'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-2 w-2 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-2' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function Avatar({
  src,
  name,
  size = 80,
}: {
  src?: string | null;
  name?: string;
  size?: number;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name || ''}
        className="rounded-full object-cover bg-primary"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full bg-primary text-white font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
}

function Modal({
  open,
  onClose,
  maxWidth = 'sm',
  children,
}: {
  open: boolean;
  onClose: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}) {
  if (!open) return null;

  const maxWidthClass =
    maxWidth === 'xs'
      ? 'max-w-xs'
      : maxWidth === 'md'
      ? 'max-w-md'
      : maxWidth === 'lg'
      ? 'max-w-lg'
      : 'max-w-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        className={`relative w-full ${maxWidthClass} rounded-2xl bg-white dark:bg-[#212B36] shadow-xl overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

function ModalTitle({
  children,
  onClose,
  disabled,
}: {
  children: React.ReactNode;
  onClose: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-3">
      <h3 className="text-base font-bold text-[#263238] dark:text-white">{children}</h3>
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        className="flex items-center justify-center w-8 h-8 rounded-full border-0 outline-none focus:outline-none bg-transparent text-grey-400 hover:bg-grey-100 hover:text-grey-600 dark:hover:bg-grey-800 dark:hover:text-grey-200 disabled:opacity-50 transition-colors cursor-pointer"
      >
        <Iconify icon="eva:close-fill" style={{ width: 20, height: 20 }} />
      </button>
    </div>
  );
}

function ModalContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-t border-b border-solid border-grey-200 dark:border-grey-700">
      {children}
    </div>
  );
}

function ModalActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-2 px-6 py-4">{children}</div>;
}

function TextField({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-grey-700 dark:text-grey-300">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-xl border border-solid bg-white dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 transition disabled:opacity-60 ${
          error
            ? 'border-red-500 focus:ring-red-300'
            : 'border-grey-300 dark:border-grey-700 focus:ring-primary'
        }`}
      />
      {helperText ? (
        <span className={`text-xs ${error ? 'text-red-500' : 'text-grey-500'}`}>{helperText}</span>
      ) : null}
    </div>
  );
}

function Button({
  children,
  onClick,
  disabled,
  variant = 'contained',
  fullWidth,
  startIcon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
  const variantClass =
    variant === 'contained'
      ? 'bg-primary hover:bg-primary-dark text-white shadow-sm'
      : 'border border-solid border-grey-300 dark:border-grey-600 text-grey-700 dark:text-grey-200 hover:bg-grey-100 dark:hover:bg-grey-800';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClass} ${fullWidth ? 'w-full' : ''}`}
    >
      {startIcon}
      {children}
    </button>
  );
}

// ────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────

export default function UsersListView() {
  const { enqueueSnackbar } = useSnackbar();
  const t = useTranslations('');
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 15;

  const [users, setUsers] = useState<Clients[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Create dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CreateClientPayload>({
    name: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<CreateClientPayload>>({});

  // View dialog state
  const [openView, setOpenView] = useState(false);
  const [viewUser, setViewUser] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ──────────────────────────────────────────────
  // Fetch customers from API
  // ──────────────────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const skipCount = (page - 1) * limit;
      const res = await axios.get<CustomersListResponse>(endpoints.clients.list, {
        params: {
          SkipCount: skipCount,
          MaxResultCount: limit,
        },
      });
      const data = res.data;
      setUsers(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to load customers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, page, limit]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ──────────────────────────────────────────────
  // Toggle active status via PUT /api/v1/admin/customers/{id}/status
  // ──────────────────────────────────────────────
  const handleToggleStatus = useCallback(
    async (user: Clients) => {
      const newIsActive = !user.isActive;
      try {
        await axios.put(`${endpoints.clients.editStatus(user.id)}?isActive=${newIsActive}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isActive: newIsActive } : u))
        );
        enqueueSnackbar('تم تحديث الحالة بنجاح', { variant: 'success' });
      } catch (err: any) {
        enqueueSnackbar(err?.message || 'Failed to update status', { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  // ──────────────────────────────────────────────
  // View single user
  // ──────────────────────────────────────────────
  const handleViewUser = useCallback(
    async (user: Clients) => {
      setOpenView(true);
      setViewLoading(true);
      try {
        const res = await axios.get(endpoints.clients.single(user.id));
        setViewUser(res.data);
      } catch (err: any) {
        enqueueSnackbar(err?.message || 'فشل تحميل بيانات العميل', { variant: 'error' });
        setOpenView(false);
      } finally {
        setViewLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  // ──────────────────────────────────────────────
  // Create customer
  // ──────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Partial<CreateClientPayload> = {};
    if (!form.name.trim()) errors.name = 'الاسم مطلوب';
    if (!form.email.trim()) errors.email = 'البريد الإلكتروني مطلوب';
    if (!form.phoneNumber.trim()) errors.phoneNumber = 'رقم الهاتف مطلوب';
    if (!form.nationalId.trim()) errors.nationalId = 'الرقم القومي مطلوب';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setCreating(true);
    try {
      await axios.post(endpoints.clients.create, form);
      enqueueSnackbar('تم إنشاء العميل بنجاح', { variant: 'success' });
      setOpenCreate(false);
      setForm({ name: '', email: '', phoneNumber: '', nationalId: '' });
      setFormErrors({});
      fetchCustomers();
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to create customer', { variant: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleCloseCreate = () => {
    if (creating) return;
    setOpenCreate(false);
    setForm({ name: '', email: '', phoneNumber: '', nationalId: '' });
    setFormErrors({});
  };

  // ──────────────────────────────────────────────
  // Table
  // ──────────────────────────────────────────────
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.phoneNumber?.includes(searchTerm)
      ),
    [users, searchTerm]
  );

  const customRender = useMemo(
    () => ({
      isActive: (user: Clients) => (
        <div className="inline-flex items-center gap-1.5 px-3 py-1">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${user.isActive ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}
          />
          <span
            className={`text-xs font-medium leading-none ${
              user.isActive ? 'text-[#16a34a]' : 'text-[#dc2626]'
            }`}
          >
            {user.isActive ? t('Global.Label.active') : t('Global.Label.inactive')}
          </span>
        </div>
      ),
      actions: (user: Clients) => (
        <div className="flex items-center gap-2">
          {/* View button */}
          <button
            type="button"
            onClick={() => handleViewUser(user)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EDF4FF] border-0 outline-none focus:outline-none text-[#2077FF] text-xs font-medium cursor-pointer transition-all hover:bg-blue-500/20"
          >
            <Iconify icon="solar:eye-linear" style={{ width: 14, height: 14 }} />
            {t('Global.Action.view')}
          </button>

          {/* Toggle status button */}
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${
              user.isActive ? 'bg-[#FDECEC]' : 'bg-[#E8FBF0]'
            }`}
          >
            <ToggleSwitch checked={user.isActive} onChange={() => handleToggleStatus(user)} />
            <span
              className={`text-xs leading-none select-none ${
                user.isActive ? 'text-[#ef4444]' : 'text-[#16a34a]'
              }`}
            >
              {user.isActive ? t('Global.Label.deactivate') : t('Global.Label.activate')}
            </span>
          </div>
        </div>
      ),
    }),
    [handleToggleStatus, handleViewUser]
  );

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-base font-bold text-[#263238] dark:text-white">
              {t('Global.Label.clients')}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-grey-500 dark:text-grey-400">
                <Iconify icon="mdi:magnify" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder={t('Pages.Messages.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-10 pe-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          </div>
        </div>

        {/* Loading state */}
        <SharedTable<Clients>
          tableHead={TABLE_HEAD}
          data={filteredUsers}
          count={totalCount}
          customRender={customRender}
          actions={[]}
          showPagination
        />
      </div>

      {/* ── Create Customer Dialog ── */}
      <Modal open={openCreate} onClose={handleCloseCreate} maxWidth="sm">
        <ModalTitle onClose={handleCloseCreate} disabled={creating}>
          إضافة عميل جديد
        </ModalTitle>

        <ModalContent>
          <div className="flex flex-col gap-5 pt-1">
            <TextField
              label="الاسم"
              value={form.name}
              onChange={(v) => setForm((p) => ({ ...p, name: v }))}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={creating}
            />
            <TextField
              label="البريد الإلكتروني"
              type="email"
              value={form.email}
              onChange={(v) => setForm((p) => ({ ...p, email: v }))}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={creating}
            />
            <TextField
              label="رقم الهاتف"
              value={form.phoneNumber}
              onChange={(v) => setForm((p) => ({ ...p, phoneNumber: v }))}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              disabled={creating}
            />
            <TextField
              label="الرقم القومي"
              value={form.nationalId}
              onChange={(v) => setForm((p) => ({ ...p, nationalId: v }))}
              error={!!formErrors.nationalId}
              helperText={formErrors.nationalId}
              disabled={creating}
            />
          </div>
        </ModalContent>

        <ModalActions>
          <Button onClick={handleCloseCreate} disabled={creating} variant="outlined">
            إلغاء
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating}
            variant="contained"
            startIcon={creating ? <Spinner size={16} className="text-white" /> : null}
          >
            {creating ? 'جارٍ الإنشاء...' : 'إنشاء العميل'}
          </Button>
        </ModalActions>
      </Modal>

      {/* ── View User Dialog ── */}
      <Modal
        open={openView}
        onClose={() => {
          if (!viewLoading) {
            setOpenView(false);
            setViewUser(null);
          }
        }}
        maxWidth="md"
      >
        <ModalTitle
          onClose={() => {
            setOpenView(false);
            setViewUser(null);
          }}
          disabled={viewLoading}
        >
          بيانات العميل
        </ModalTitle>

        <ModalContent>
          {viewLoading ? (
            <div className="flex justify-center items-center py-14 text-grey-500">
              <Spinner size={32} />
            </div>
          ) : viewUser ? (
            <div className="flex flex-col items-center">
              {/* Avatar with soft header band */}
              <div className="relative w-full flex justify-center pt-2 pb-3">
                <div className="absolute top-0 inset-x-0 h-14 rounded-t-xl bg-gradient-to-b from-primary/10 to-transparent" />
                <div className="relative ring-4 ring-white dark:ring-[#212B36] rounded-full shadow-lg">
                  <Avatar src={viewUser.profileImage} name={viewUser.name} size={104} />
                </div>
              </div>

              <h4 className="text-base font-bold text-[#263238] dark:text-white">
                {viewUser.name || '—'}
              </h4>

              {/* Status badge */}
              <div
                className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-solid ${
                  viewUser.isActive
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${viewUser.isActive ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}
                />
                <span
                  className={`text-xs font-semibold ${
                    viewUser.isActive ? 'text-[#16a34a]' : 'text-[#dc2626]'
                  }`}
                >
                  {viewUser.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>

              {/* Info card */}
              <div className="w-full mt-5 rounded-xl bg-grey-50 dark:bg-grey-800/40 p-4 flex flex-col gap-3.5">
                {[
                  { label: 'الاسم', value: viewUser.name },
                  { label: 'البريد الإلكتروني', value: viewUser.email },
                  { label: 'رقم الهاتف', value: viewUser.phoneNumber },
                ].map((row) => (
                  <div key={row.label} className="w-full flex justify-between items-center">
                    <span className="text-sm text-grey-500 font-medium">{row.label}</span>
                    <span className="text-sm font-semibold text-grey-800 dark:text-grey-100">
                      {row.value || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </ModalContent>

        <ModalActions>
          <Button
            onClick={() => {
              setOpenView(false);
              setViewUser(null);
            }}
            variant="outlined"
            fullWidth
          >
            إغلاق
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
}