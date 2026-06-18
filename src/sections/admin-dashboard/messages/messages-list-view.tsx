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
  Badge,
  Pagination,
} from '@mui/material';
import {
  _messagesList,
  MESSAGE_STATUS_OPTIONS,
  MESSAGE_PRIORITY_OPTIONS,
} from 'src/_mock/_dashboard-messages';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

export default function MessagesListView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredMessages = _messagesList.filter(
    (msg) =>
      msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedMessages = filteredMessages.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return 'mdi:email';
      case 'read':
        return 'mdi:email-open';
      case 'replied':
        return 'mdi:reply';
      case 'archived':
        return 'mdi:archive';
      default:
        return 'mdi:email';
    }
  };

  const unreadCount = _messagesList.filter((m) => !m.isRead).length;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" spacing={2} alignItems="center">
              <span>إدارة الرسائل</span>
              <Badge badgeContent={unreadCount} color="error">
                <Iconify icon="mdi:email" />
              </Badge>
            </Stack>
          }
          subheader="إدارة رسائل اتصل بنا وقراءة الرسائل الواردة"
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
                <TableCell align="right">الحالة</TableCell>
                <TableCell align="right">المرسل</TableCell>
                <TableCell align="right">الموضوع</TableCell>
                <TableCell align="right">الفئة</TableCell>
                <TableCell align="right">الأولوية</TableCell>
                <TableCell align="right">التاريخ</TableCell>
                <TableCell align="right">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMessages.map((message) => (
                <TableRow
                  key={message.id}
                  hover
                  sx={{
                    bgcolor: !message.isRead ? 'action.hover' : 'transparent',
                  }}
                >
                  <TableCell align="right">
                    <Iconify icon={getStatusIcon(message.status)} />
                  </TableCell>
                  <TableCell align="right">{message.senderName}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: !message.isRead ? 'bold' : 'normal',
                      }}
                    >
                      {message.subject}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{message.category}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={
                        MESSAGE_PRIORITY_OPTIONS.find((p) => p.value === message.priority)?.label
                      }
                      color={getPriorityColor(message.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {new Date(message.receivedAt).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined">
                        عرض
                      </Button>
                      <Button size="small" variant="outlined" color="success">
                        رد
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredMessages.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      </Card>
    </Box>
  );
}
