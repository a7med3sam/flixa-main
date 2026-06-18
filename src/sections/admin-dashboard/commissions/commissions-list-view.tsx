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
  TextField,
  Chip,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardHeader,
} from '@mui/material';
import {
  _commissionsList,
  COMMISSION_TYPE_OPTIONS,
  COMMISSION_STATUS_OPTIONS,
} from 'src/_mock/_dashboard-commissions';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

type DashboardCommission = (typeof _commissionsList)[number];

type CommissionActionsProps = {
  commission: DashboardCommission;
  onAdd: VoidFunction;
  onEdit: (commission: DashboardCommission) => void;
  onDelete: (commissionId: string) => void;
};

function CommissionActions({ commission, onAdd, onEdit, onDelete }: CommissionActionsProps) {
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

        <MenuItem onClick={() => handleAction(() => onEdit(commission))}>
          <ListItemIcon>
            <Iconify icon="solar:pen-bold" />
          </ListItemIcon>
          <ListItemText>تعديل</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(() => onDelete(commission.id))}
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

export default function CommissionsListView() {
  const [commissions, setCommissions] = useState(_commissionsList);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommissions = commissions.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleAddCommission = () => {
    const newCommission: DashboardCommission = {
      ..._commissionsList[0],
      id: Date.now().toString(),
      name: 'عمولة جديدة',
      type: 'percentage',
      rate: '0',
      minAmount: 0,
      maxAmount: 0,
      status: 'pending',
      totalTransactions: 0,
      totalAmount: 0,
      totalCommission: 0,
    };

    setCommissions((prevCommissions) => [newCommission, ...prevCommissions]);
  };

  const handleEditCommission = (commission: DashboardCommission) => {
    setCommissions((prevCommissions) =>
      prevCommissions.map((item) =>
        item.id === commission.id
          ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
          : item
      )
    );
  };

  const handleDeleteCommission = (commissionId: string) => {
    setCommissions((prevCommissions) =>
      prevCommissions.filter((commission) => commission.id !== commissionId)
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="إدارة العمولات"
          subheader="إدارة العمولات على المدفوعات المنفذة"
          sx={{ mb: 2 }}
          action={
            <TextField
              placeholder="البحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <TableCell align="right">النوع</TableCell>
                <TableCell align="right">النسبة/المبلغ</TableCell>
                <TableCell align="right">الحد الأدنى</TableCell>
                <TableCell align="right">الحد الأقصى</TableCell>
                <TableCell align="right">الحالة</TableCell>
                <TableCell align="right">إجمالي العمولات</TableCell>
                <TableCell align="right">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCommissions.map((commission) => (
                <TableRow key={commission.id} hover>
                  <TableCell align="right">{commission.name}</TableCell>
                  <TableCell align="right">
                    {COMMISSION_TYPE_OPTIONS.find((t) => t.value === commission.type)?.label}
                  </TableCell>
                  <TableCell align="right">
                    {commission.type === 'percentage'
                      ? `${commission.rate}%`
                      : `${commission.rate} ريال`}
                  </TableCell>
                  <TableCell align="right">{commission.minAmount}</TableCell>
                  <TableCell align="right">{commission.maxAmount}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={
                        COMMISSION_STATUS_OPTIONS.find((s) => s.value === commission.status)?.label
                      }
                      color={getStatusColor(commission.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{commission.totalCommission.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <CommissionActions
                      commission={commission}
                      onAdd={handleAddCommission}
                      onEdit={handleEditCommission}
                      onDelete={handleDeleteCommission}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
