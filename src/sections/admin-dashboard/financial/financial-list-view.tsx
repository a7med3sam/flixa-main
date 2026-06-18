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
  Button,
  Stack,
} from '@mui/material';
import { _financialReports, _financialSummary } from 'src/_mock/_dashboard-financial';

export default function FinancialListView() {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي الإيرادات
              </Typography>
              <Typography variant="h5">
                {_financialSummary.totalRevenue.toLocaleString()} ريال
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي المصروفات
              </Typography>
              <Typography variant="h5">
                {_financialSummary.totalExpenses.toLocaleString()} ريال
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                صافي الربح
              </Typography>
              <Typography variant="h5" sx={{ color: 'success.main' }}>
                {_financialSummary.netProfit.toLocaleString()} ريال
              </Typography>
              <Typography variant="body2">نسبة الربح: {_financialSummary.profitMargin}%</Typography>
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
                {_financialSummary.totalCommissions.toLocaleString()} ريال
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Reports Table */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="التقارير المالية" sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                  <TableRow>
                    <TableCell align="right">العنوان</TableCell>
                    <TableCell align="right">الفترة</TableCell>
                    <TableCell align="right">الإيرادات</TableCell>
                    <TableCell align="right">المصروفات</TableCell>
                    <TableCell align="right">الربح</TableCell>
                    <TableCell align="right">نسبة الربح</TableCell>
                    <TableCell align="right">الحالة</TableCell>
                    <TableCell align="right">الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_financialReports.slice(0, 10).map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell align="right">{report.title}</TableCell>
                      <TableCell align="right">{report.period}</TableCell>
                      <TableCell align="right">{report.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{report.expenses.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main' }}>
                        {report.profit.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">{report.profitMargin}%</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={report.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                          color={report.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="outlined">
                            عرض
                          </Button>
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
    </Box>
  );
}
