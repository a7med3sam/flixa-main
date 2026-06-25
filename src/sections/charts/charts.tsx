'use client';

import type { ApexOptions } from 'apexcharts';

import ApexChart from 'src/components/ApexChart';
import DashboardCard from 'src/components/DashboardCard';
import { useTranslations } from 'next-intl';
import {
  BRANCH_BAR_COLORS,
  BRANCH_PERFORMANCE,
  CHART_BARS,
  CHART_LINE,
  CHART_MONTHS,
  CHART_MONTHS_SECOND,
  MONTH_LABELS,
} from './constants';

const baseChartOptions: ApexOptions = {
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
  xaxis: {
    categories: MONTH_LABELS,
    labels: { style: { colors: '#9CA3AF', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: { style: { colors: '#9CA3AF', fontSize: '12px' } },
  },
  legend: { show: false },
  tooltip: { theme: 'light' },
};

function ChartHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-lg font-bold text-[#111827] mb-0.5">{title}</h2>
      <p className="text-[13px] text-[#6B7280]">{subtitle}</p>
    </div>
  );
}

export function DailyCouponUsageChart() {
  const t = useTranslations('');
  const options: ApexOptions = {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'line', height: 340 },
    stroke: { width: [0, 3], curve: 'smooth' },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4,
      },
    },
    colors: ['#10B981', '#EF4444'],
    fill: {
      type: ['solid', 'gradient'],
      opacity: [0.9, 0.15],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
  };

  const series = [
    { name: 'الاستخدام', type: 'column', data: [...CHART_BARS] },
    { name: 'الاتجاه', type: 'area', data: [...CHART_LINE] },
  ];

  return (
    <DashboardCard className="h-auto md:h-[420px]">
      <ChartHeader title="معدل العمليات اليومية" subtitle="(+43%) أعلى من الأسبوع الماضي" />
      <ApexChart options={options} series={series} type="line" height={340} />
    </DashboardCard>
  );
}

export function MonthlyPerformanceChart() {
  const t = useTranslations('');
  const options: ApexOptions = {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'area', height: 340 },
    stroke: { width: 3, curve: 'smooth' },
    colors: ['#10B981', '#EAB308'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
  };

  const series = [
    { name: 'السلسلة 1', data: [...CHART_MONTHS] },
    { name: 'السلسلة 2', data: [...CHART_MONTHS_SECOND] },
  ];

  return (
    <DashboardCard className="h-auto md:h-[420px] mb-9">
      <ChartHeader title={t("Global.Label.monthlyPerformance")} subtitle={t("Global.Label.upper_than_last_month")} />
      <ApexChart options={options} series={series} type="area" height={340} />
    </DashboardCard>
  );
}

export function BranchPerformanceChart() {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      height: 260,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '55%',
        distributed: true,
        borderRadius: 6,
      },
    },
    colors: BRANCH_BAR_COLORS,
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: BRANCH_PERFORMANCE.map((b) => b.name),
      max: 900,
      labels: { style: { colors: '#9CA3AF', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#374151', fontSize: '13px', fontWeight: 500 },
      },
    },
    legend: { show: false },
    tooltip: { theme: 'light' },
  };

  const series = [
    {
      name: 'الأداء',
      data: BRANCH_PERFORMANCE.map((b) => b.value),
    },
  ];

  return (
    <DashboardCard className="h-auto md:h-[320px]">
      <h2 className="text-lg font-bold text-[#111827] mb-2">مقارنة أداء المستخدمين</h2>
      <ApexChart options={options} series={series} type="bar" height={260} />
    </DashboardCard>
  );
}

export function AnalyticsSection() {
  return (
    // <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-3">
    //   <DailyCouponUsageChart />
    //   <MonthlyPerformanceChart />
    // </div>
    <div>
      {/* <DailyCouponUsageChart /> */}
      <MonthlyPerformanceChart />
    </div>
  );
}
