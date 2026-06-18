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
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardHeader,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { USER_STATUS_OPTIONS, _dashboardUsers } from 'src/_mock/_dashboard-users';

type DashboardUser = (typeof _dashboardUsers)[number];

type UserActionsProps = {
  user: DashboardUser;
  onAdd: VoidFunction;
  onEdit: (user: DashboardUser) => void;
  onDelete: (userId: string) => void;
};

function UserActions({ user, onAdd, onEdit, onDelete }: UserActionsProps) {
  const popover = usePopover();

  const handleAction = (callback: VoidFunction) => {
    callback();
    popover.onClose();
  };

  return (
    <>
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ minWidth: 150 }}
      >
        <MenuItem onClick={() => handleAction(onAdd)}>
          <ListItemIcon>
            <Iconify icon="solar:add-circle-bold" />
          </ListItemIcon>
          <ListItemText>إضافة</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleAction(() => onEdit(user))}>
          <ListItemIcon>
            <Iconify icon="solar:pen-bold" />
          </ListItemIcon>
          <ListItemText>تعديل</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(() => onDelete(user.id))}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </ListItemIcon>
          <ListItemText>حذف</ListItemText>
        </MenuItem>
      </CustomPopover>
    </>
  );
}

export default function UsersListView() {
  const [users, setUsers] = useState(_dashboardUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
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

  const handleStatusChange = (user: DashboardUser) => {
    setSelectedUser(user);
    setNewStatus(user.status);
    setOpenDialog(true);
  };

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

    setUsers((prevUsers) => [newUser, ...prevUsers]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
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
                    <UserActions
                      user={user}
                      onAdd={handleAddUser}
                      onEdit={handleStatusChange}
                      onDelete={handleDeleteUser}
                    />
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
