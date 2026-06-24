'use client';

import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clients, CreateClientPayload, CustomersListResponse } from 'src/types/clients';
import Switch from '@mui/material/Switch';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Box,
  Typography,
  IconButton,
} from '@mui/material';

const TABLE_HEAD = [
  { id: 'name', label: 'Global.Label.name' },
  { id: 'email', label: 'Global.Label.email' },
  { id: 'phoneNumber', label: 'Global.Label.phone' },
  { id: 'isActive', label: 'Global.Label.status' },
];

export default function UsersListView() {
  const { enqueueSnackbar } = useSnackbar();

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

  // ──────────────────────────────────────────────
  // Fetch customers from API
  // ──────────────────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<CustomersListResponse>(endpoints.clients.list);
      const data = res.data;
      setUsers(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to load customers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

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
        <Switch
          checked={user.isActive}
          onChange={() => handleToggleStatus(user)}
          color="primary"
          inputProps={{ 'aria-label': 'toggle status' }}
        />
      ),
    }),
    [handleToggleStatus]
  );

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-[#263238] dark:text-white">إدارة العملاء</h2>
            <p className="mt-0.5 text-sm text-grey-600 dark:text-grey-400">
              إدارة حسابات العملاء وتفعيلها أو تعطيلها
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
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

            {/* Add customer button */}
            {/* <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-sm transition-colors"
            >
              <Iconify icon="solar:add-circle-bold" className="w-4 h-4" />
              إضافة عميل
            </button> */}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <SharedTable<Clients>
            tableHead={TABLE_HEAD}
            data={filteredUsers}
            count={totalCount}
            customRender={customRender}
            actions={[]}
          />
        )}
      </div>

      {/* ── Create Customer Dialog ── */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            إضافة عميل جديد
          </Typography>
          <IconButton onClick={handleCloseCreate} disabled={creating} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5} pt={1}>
            <TextField
              label="الاسم"
              fullWidth
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={creating}
            />
            <TextField
              label="البريد الإلكتروني"
              fullWidth
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={creating}
            />
            <TextField
              label="رقم الهاتف"
              fullWidth
              value={form.phoneNumber}
              onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              disabled={creating}
            />
            <TextField
              label="الرقم القومي"
              fullWidth
              value={form.nationalId}
              onChange={(e) => setForm((p) => ({ ...p, nationalId: e.target.value }))}
              error={!!formErrors.nationalId}
              helperText={formErrors.nationalId}
              disabled={creating}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={handleCloseCreate} disabled={creating} variant="outlined" color="inherit">
            إلغاء
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating}
            variant="contained"
            color="primary"
            startIcon={creating ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {creating ? 'جارٍ الإنشاء...' : 'إنشاء العميل'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
