'use client';

import {
  Box,
  Grid,
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
  Button,
  Stack,
  Chip,
  TextField,
} from '@mui/material';
import { _contentPages } from 'src/_mock/_dashboard-content';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Iconify from 'src/components/iconify';

export default function ContentListView() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPages = _contentPages.filter((page) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="إدارة المحتوى النصي"
          subheader="إدارة محتوى الصفحات الثابتة (من نحن، الشروط والأحكام، سياسة الخصوصية)"
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
                <TableCell align="right">العنوان</TableCell>
                <TableCell align="right">اللغة</TableCell>
                <TableCell align="right">الحالة</TableCell>
                <TableCell align="right">آخر تحديث</TableCell>
                <TableCell align="right">المشاهدات</TableCell>
                <TableCell align="right">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id} hover>
                  <TableCell align="right">{page.title}</TableCell>
                  <TableCell align="right">
                    {page.language === 'ar' ? 'العربية' : 'الإنجليزية'}
                  </TableCell>
                  <TableCell align="right">
                    <Chip label="منشور" color="success" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {new Date(page.lastUpdated).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell align="right">{page.views}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => router.push(`/content/${page.slug}`)}
                      >
                        تعديل
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        حذف
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
