'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Card,
  CardHeader,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import { USER_STATUS_OPTIONS, _dashboardUsers } from 'src/_mock/_dashboard-users';

export default function UsersListView() {
  const t = useTranslations();
  const [users, setUsers] = useState(_dashboardUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (user: any) => {
    setSelectedUser(user);
    setNewStatus(user.status);
    setOpenDialog(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedUser) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u)));
    }
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status: string) => {
    const statusOption = USER_STATUS_OPTIONS.find((opt) => opt.value === status);
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="إدارة المستخدمين"
          subheader="إدارة حسابات المستخدمين وتفعيلها أو تعطيلها"
          sx={{ mb: 2 }}
          action={
            <TextField
              placeholder="البحث..."
              value={searchTerm}
              onChange={handleSearch}
              size="small"
              InputProps={{
                startAdornment: <Iconify icon="mdi:magnify" sx={{ mr: 1 }} />,
              }}
            />
          }
        />
        <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'background.neutral' }}>
              <TableRow>
                <TableCell align="right">الاسم</TableCell>
                <TableCell align="right">البريد الإلكتروني</TableCell>
                <TableCell align="right">الهاتف</TableCell>
                <TableCell align="right">الحالة</TableCell>
                <TableCell align="right">عدد الطلبات</TableCell>
                <TableCell align="right">إجمالي الإنفاق</TableCell>
                <TableCell align="right">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell align="right">{user.name}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.phone}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={USER_STATUS_OPTIONS.find((opt) => opt.value === user.status)?.label}
                      color={getStatusColor(user.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{user.totalOrders}</TableCell>
                  <TableCell align="right">{(user.totalSpent ?? 0).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleStatusChange(user)}
                      >
                        تغيير الحالة
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>تغيير حالة المستخدم</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="الحالة الجديدة"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              {USER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
          <Button onClick={handleConfirmStatusChange} variant="contained">
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
