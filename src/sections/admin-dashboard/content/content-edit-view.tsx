'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Container,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { _contentDetail } from 'src/_mock/_dashboard-content';
import { fDate } from 'src/utils/format-time';

interface Props {
  slug: string;
}

const PAGE_META: Record<string, { ar: string; en: string; icon: string; color: string }> = {
  'about-us': {
    ar: 'عن التطبيق',
    en: 'About Us',
    icon: 'mdi:information-outline',
    color: '#2065D1',
  },
  'terms-conditions': {
    ar: 'الشروط والأحكام',
    en: 'Terms & Conditions',
    icon: 'mdi:file-document-outline',
    color: '#7A0C2E',
  },
  'privacy-policy': {
    ar: 'سياسة الخصوصية',
    en: 'Privacy Policy',
    icon: 'mdi:shield-account-outline',
    color: '#118D57',
  },
};

export default function ContentEditView({ slug }: Props) {
  const router = useRouter();
  const detail = _contentDetail(slug);
  const meta = PAGE_META[slug] || PAGE_META['about-us'];

  const [title, setTitle] = useState(detail.title);
  const [content, setContent] = useState(detail.content);
  const [metaDescription, setMetaDescription] = useState(detail.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(detail.metaKeywords);
  const [status, setStatus] = useState(detail.status);
  const [dirty, setDirty] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange =
    (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setDirty(true);
    };

  const handleSave = () => {
    setSnackbar({ open: true, message: 'تم حفظ التغييرات بنجاح', severity: 'success' });
    setDirty(false);
  };

  const handlePublishToggle = () => {
    const newStatus = status === 'published' ? 'draft' : 'published';
    setStatus(newStatus);
    setSnackbar({
      open: true,
      message: newStatus === 'published' ? 'تم نشر الصفحة' : 'تم تحويل الصفحة إلى مسودة',
      severity: 'success',
    });
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <CustomBreadcrumbs
          heading={meta.ar}
          links={[{ name: 'إدارة المحتوى', href: '/content' }, { name: meta.ar }]}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title="المحتوى الأساسي"
                subheader="قم بتعديل محتوى الصفحة والنصوص الوصفية"
                sx={{ '& .MuiCardHeader-subheader': { mt: 0.5 } }}
              />
              <Divider />
              <CardContent sx={{ pt: 3 }}>
                <Stack spacing={3.5}>
                  <TextField
                    label="عنوان الصفحة"
                    value={title}
                    onChange={handleChange(setTitle)}
                    fullWidth
                    dir="rtl"
                    variant="outlined"
                    sx={{
                      '& .MuiInputLabel-root': { transformOrigin: 'top right' },
                    }}
                  />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                      محتوى الصفحة
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.50',
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <TextField
                        value={content}
                        onChange={handleChange(setContent)}
                        fullWidth
                        multiline
                        rows={18}
                        dir="rtl"
                        variant="standard"
                        placeholder="اكتب محتوى الصفحة هنا..."
                        sx={{
                          '& .MuiInputBase-root': {
                            fontFamily: '"Cairo", sans-serif',
                            fontSize: '0.95rem',
                            lineHeight: 2,
                            bgcolor: 'background.paper',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            '&:before': { display: 'none' },
                            '&:after': { display: 'none' },
                          },
                        }}
                      />
                    </Paper>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* SEO Section */}
            <Card>
              <CardHeader
                title="تحسين محركات البحث (SEO)"
                subheader="حسّن ظهور الصفحة في نتائج البحث"
                avatar={
                  <Avatar sx={{ bgcolor: 'warning.light', width: 36, height: 36 }}>
                    <Iconify icon="mdi:search-web" width={20} />
                  </Avatar>
                }
                sx={{ '& .MuiCardHeader-subheader': { mt: 0.5 } }}
              />
              <Divider />
              <CardContent sx={{ pt: 3 }}>
                <Stack spacing={3.5}>
                  <TextField
                    label="Meta Description"
                    value={metaDescription}
                    onChange={handleChange(setMetaDescription)}
                    fullWidth
                    multiline
                    rows={2}
                    dir="rtl"
                    variant="outlined"
                    helperText={
                      <Box
                        component="span"
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                      >
                        <span>وصف مختصر يظهر في نتائج البحث</span>
                        <Box
                          component="span"
                          sx={{
                            fontWeight: metaDescription.length > 160 ? 'bold' : 'normal',
                            color: metaDescription.length > 160 ? 'error.main' : 'text.secondary',
                          }}
                        >
                          {metaDescription.length} / 160 حرف
                        </Box>
                      </Box>
                    }
                    sx={{ '& .MuiInputLabel-root': { transformOrigin: 'top right' } }}
                  />

                  <TextField
                    label="الكلمات المفتاحية (Meta Keywords)"
                    value={metaKeywords}
                    onChange={handleChange(setMetaKeywords)}
                    fullWidth
                    dir="rtl"
                    variant="outlined"
                    placeholder="الكلمة1، الكلمة2، الكلمة3"
                    helperText="افصل بين الكلمات المفتاحية بفاصلة"
                    sx={{ '& .MuiInputLabel-root': { transformOrigin: 'top right' } }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Page Info Card */}
              <Card>
                <CardHeader
                  title="بيانات الصفحة"
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
                      <Iconify icon={meta.icon} width={20} />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ borderBottom: 0, pr: 3, color: 'text.secondary', width: 100 }}
                          >
                            الحالة
                          </TableCell>
                          <TableCell sx={{ borderBottom: 0 }}>
                            <Chip
                              label={status === 'published' ? 'منشور' : 'مسودة'}
                              color={status === 'published' ? 'success' : 'warning'}
                              size="small"
                              variant="soft"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ borderBottom: 0, pr: 3, color: 'text.secondary' }}>
                            اللغة
                          </TableCell>
                          <TableCell sx={{ borderBottom: 0 }}>
                            <Chip label="العربية" color="primary" size="small" variant="soft" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ borderBottom: 0, pr: 3, color: 'text.secondary' }}>
                            الرابط
                          </TableCell>
                          <TableCell sx={{ borderBottom: 0 }}>
                            <Typography
                              variant="body2"
                              dir="ltr"
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                color: 'primary.main',
                              }}
                            >
                              /{slug}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ borderBottom: 0, pr: 3, color: 'text.secondary' }}>
                            المشاهدات
                          </TableCell>
                          <TableCell sx={{ borderBottom: 0 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Iconify
                                icon="mdi:eye-outline"
                                width={16}
                                sx={{ color: 'text.disabled' }}
                              />
                              <Typography variant="subtitle2">
                                {detail.views.toLocaleString()}
                              </Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Publishing Info Card */}
              <Card>
                <CardHeader
                  title="النشر"
                  avatar={
                    <Avatar sx={{ bgcolor: 'success.light', width: 36, height: 36 }}>
                      <Iconify icon="mdi:cloud-upload-outline" width={20} />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ borderBottom: 0, pr: 3, color: 'text.secondary', width: 100 }}
                          >
                            آخر تحديث
                          </TableCell>
                          <TableCell sx={{ borderBottom: 0 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Iconify
                                icon="mdi:clock-outline"
                                width={16}
                                sx={{ color: 'text.disabled' }}
                              />
                              <Typography variant="body2">
                                {fDate(detail.lastUpdated, 'dd/MM/yyyy، hh:mm a')}
                              </Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ borderBottom: 0, pr: 3, color: 'text.secondary' }}>
                            بواسطة
                          </TableCell>
                          <TableCell sx={{ borderBottom: 0 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: 'primary.main',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {detail.updatedBy.charAt(0)}
                              </Avatar>
                              <Typography variant="body2">{detail.updatedBy}</Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ borderBottom: 0, pr: 3, color: 'text.secondary' }}>
                            تاريخ النشر
                          </TableCell>
                          <TableCell sx={{ borderBottom: 0 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Iconify
                                icon="mdi:calendar-outline"
                                width={16}
                                sx={{ color: 'text.disabled' }}
                              />
                              <Typography variant="body2">
                                {fDate(detail.publishedAt, 'dd/MM/yyyy')}
                              </Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardHeader
                  title="الإجراءات"
                  avatar={
                    <Avatar sx={{ bgcolor: 'grey.500', width: 36, height: 36 }}>
                      <Iconify icon="mdi:lightning-bolt-outline" width={20} />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleSave}
                      startIcon={<Iconify icon="mdi:content-save" />}
                      disabled={!dirty}
                    >
                      حفظ التغييرات
                    </Button>
                    <Button
                      variant={status === 'published' ? 'outlined' : 'soft'}
                      color={status === 'published' ? 'warning' : 'success'}
                      size="large"
                      fullWidth
                      onClick={handlePublishToggle}
                      startIcon={
                        <Iconify
                          icon={
                            status === 'published' ? 'mdi:eye-off-outline' : 'mdi:eye-check-outline'
                          }
                        />
                      }
                    >
                      {status === 'published' ? 'إلغاء النشر' : 'نشر الصفحة'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="large"
                      fullWidth
                      onClick={() => router.push('/content')}
                      startIcon={<Iconify icon="mdi:arrow-right" />}
                    >
                      العودة إلى القائمة
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ '& .MuiAlert-message': { fontSize: '0.9rem' } }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
