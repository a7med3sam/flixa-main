
'use client';

import { Box, Grid, Card, CardContent, Typography, LinearProgress, Button, Stack } from '@mui/material';
import { _statisticsSummary, _orderStatusReport } from 'src/_mock/_dashboard-reports';
import { _financialSummary } from 'src/_mock/_dashboard-financial';
import Link from 'next/link';
import { paths } from 'src/routes/paths';

// Mock Chart Component
const SimpleChart = () => (
  <Box sx={{ height: 300, bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
    <Typography variant="subtitle2">النمو الشهري</Typography>
    {[85, 65, 78, 92, 88, 95].map((val, i) => (
      <Box key={i} sx={{ mb: 1 }}>
        <Typography variant="caption">{`أسبوع ${i + 1}`}</Typography>
        <LinearProgress variant="determinate" value={val} />
      </Box>
    ))}
  </Box>
);

export default function DashboardPage() {
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
                ↑ {_statisticsSummary.newUsers} مستخدم جديد
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
              <Typography variant="h5">{_statisticsSummary.totalOrders.toLocaleString()}</Typography>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                {((_statisticsSummary.completedOrders / _statisticsSummary.totalOrders) * 100).toFixed(1)}% مكتمل
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
              <Typography variant="h5">{_financialSummary.totalRevenue.toLocaleString()} ريال</Typography>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                ↑ نمو إيجابي
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
              <Typography variant="body2">
                {_financialSummary.profitMargin}% نسبة الربح
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <SimpleChart />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                حالة الطلبات
              </Typography>
              {_orderStatusReport.map((item, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{item.status}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.value.toLocaleString()}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(item.value / _statisticsSummary.totalOrders) * 100}
                    sx={{ bgcolor: '#e0e0e0' }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        {/* <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                روابط سريعة
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                <Button variant="contained" component={Link} href={paths.dashboard.users.list}>
                  إدارة المستخدمين
                </Button>
                <Button variant="outlined" component={Link} href={paths.dashboard.commissions.list}>
                  العمولات
                </Button>
                <Button variant="outlined" component={Link} href={paths.dashboard.reports.list}>
                  التقارير
                </Button>
                <Button variant="outlined" component={Link} href={paths.dashboard.financial.list}>
                  الماليات
                </Button>
                <Button variant="outlined" component={Link} href={paths.dashboard.messages.list}>
                  الرسائل
                </Button>
                <Button variant="outlined" component={Link} href={paths.dashboard.notifications.list}>
                  الإشعارات
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  );
}

//   return {
//     title: t('title'),
//   };
// }
