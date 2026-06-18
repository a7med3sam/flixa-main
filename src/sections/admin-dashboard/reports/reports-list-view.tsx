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
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  _statisticsSummary,
  _userActivityReport,
  _recentReports,
} from 'src/_mock/_dashboard-reports';

export default function ReportsListView() {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي المستخدمين
              </Typography>
              <Typography variant="h5">{_statisticsSummary.totalUsers.toLocaleString()}</Typography>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                المستخدمون النشطون: {_statisticsSummary.activeUsers.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي الطلبات
              </Typography>
              <Typography variant="h5">
                {_statisticsSummary.totalOrders.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                الطلبات المكتملة: {_statisticsSummary.completedOrders.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي الإيرادات
              </Typography>
              <Typography variant="h5">
                {_statisticsSummary.totalRevenue.toLocaleString()} ريال
              </Typography>
              <Typography variant="body2">
                متوسط قيمة الطلب: {_statisticsSummary.averageOrderValue.toLocaleString()} ريال
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي العمولات
              </Typography>
              <Typography variant="h5">
                {_statisticsSummary.totalCommissions.toLocaleString()} ريال
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Reports Table */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="آخر التقارير" />
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                  <TableRow>
                    <TableCell align="right">العنوان</TableCell>
                    <TableCell align="right">النوع</TableCell>
                    <TableCell align="right">الفترة</TableCell>
                    <TableCell align="right">تاريخ الإنشاء</TableCell>
                    <TableCell align="right">الحالة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_recentReports.slice(0, 5).map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell align="right">{report.title}</TableCell>
                      <TableCell align="right">{report.type}</TableCell>
                      <TableCell align="right">{report.period}</TableCell>
                      <TableCell align="right">
                        {new Date(report.createdAt).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={report.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                          color={report.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
