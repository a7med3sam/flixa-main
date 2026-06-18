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
  Button,
  Stack,
  Card,
  CardHeader,
} from '@mui/material';
import {
  _commissionsList,
  COMMISSION_TYPE_OPTIONS,
  COMMISSION_STATUS_OPTIONS,
} from 'src/_mock/_dashboard-commissions';
import Iconify from 'src/components/iconify';

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
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined">
                        تعديل
                      </Button>
                    </Stack>
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
