'use client';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  _notificationsList,
  NOTIFICATION_TYPE_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS,
  NOTIFICATION_RECIPIENTS_OPTIONS,
} from 'src/_mock/_dashboard-notifications';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

export default function NotificationsListView() {
  const [notifications, setNotifications] = useState(_notificationsList);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    type: 'announcement',
    recipients: 'all',
    language: 'both',
  });

  const filteredNotifications = notifications.filter((n) =>
    n.titleAr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'scheduled':
        return 'warning';
      case 'draft':
        return 'default';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      type: 'announcement',
      recipients: 'all',
      language: 'both',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotif(null);
  };

  const handleCreateNotification = () => {
    // In a real app, this would call an API
    console.log('Creating notification:', formData);
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي الإشعارات
              </Typography>
              <Typography variant="h5">{notifications.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                الإشعارات المرسلة
              </Typography>
              <Typography variant="h5">
                {notifications.filter((n) => n.status === 'sent').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                المجدولة
              </Typography>
              <Typography variant="h5">
                {notifications.filter((n) => n.status === 'scheduled').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                المسودات
              </Typography>
              <Typography variant="h5">
                {notifications.filter((n) => n.status === 'draft').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications Table */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="إدارة الإشعارات"
              subheader="إدارة الإشعارات والتنبيهات وإرسالها للمستخدمين"
              action={
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    placeholder="البحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: <Iconify icon="mdi:magnify" sx={{ mr: 1 }} />,
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleOpenDialog}
                    startIcon={<Iconify icon="mdi:plus" />}
                  >
                    إشعار جديد
                  </Button>
                </Stack>
              }
            />
            <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                  <TableRow>
                    <TableCell align="right">العنوان (العربية)</TableCell>
                    <TableCell align="right">النوع</TableCell>
                    <TableCell align="right">الحالة</TableCell>
                    <TableCell align="right">المستقبلون</TableCell>
                    <TableCell align="right">نسبة النجاح</TableCell>
                    <TableCell align="right">التاريخ</TableCell>
                    <TableCell align="right">الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNotifications.map((notif) => (
                    <TableRow key={notif.id} hover>
                      <TableCell align="right">{notif.titleAr}</TableCell>
                      <TableCell align="right">
                        {NOTIFICATION_TYPE_OPTIONS.find((t) => t.value === notif.type)?.label}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={
                            NOTIFICATION_STATUS_OPTIONS.find((s) => s.value === notif.status)?.label
                          }
                          color={getStatusColor(notif.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{notif.recipientCount.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        {notif.status === 'sent'
                          ? `${((notif.successCount / notif.recipientCount) * 100).toFixed(1)}%`
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {new Date(notif.createdAt).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="outlined">
                            عرض
                          </Button>
                          {notif.status === 'draft' && (
                            <Button size="small" variant="outlined" color="success">
                              إرسال
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Create Notification Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>إنشاء إشعار جديد</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="العنوان (العربية)"
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
          />
          <TextField
            fullWidth
            label="العنوان (الإنجليزية)"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="الوصف (العربية)"
            value={formData.descriptionAr}
            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="الوصف (الإنجليزية)"
            value={formData.descriptionEn}
            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
          />
          <FormControl fullWidth>
            <FormLabel>النوع</FormLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {NOTIFICATION_TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>المستقبلون</FormLabel>
            <Select
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
            >
              {NOTIFICATION_RECIPIENTS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleCreateNotification} variant="contained">
            إنشاء
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
