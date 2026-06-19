'use client';

import { _statisticsSummary, _orderStatusReport } from 'src/_mock/_dashboard-reports';
import { _financialSummary } from 'src/_mock/_dashboard-financial';
import Link from 'next/link';
import { paths } from 'src/routes/paths';

// Mock Chart Component
const SimpleChart = () => (
  <div className="h-[300px] flex flex-col justify-between">
    <h3 className="text-sm font-semibold text-[#263238] dark:text-white">النمو الشهري</h3>
    <div className="flex-1 flex flex-col justify-end gap-3 mt-4">
      {[85, 65, 78, 92, 88, 95].map((val, i) => (
        <div key={i} className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-grey-600 dark:text-grey-500">{`أسبوع ${i + 1}`}</span>
            <span className="text-xs font-medium text-grey-600 dark:text-grey-500">{`${val}%`}</span>
          </div>
          <div className="w-full h-1.5 bg-[#e0e0e0] dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Summary Cards */}
        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-6">
            <span className="block text-sm font-medium text-grey-600 dark:text-grey-500 mb-2">
              إجمالي المستخدمين
            </span>
            <h4 className="text-xl md:text-2xl font-bold text-[#263238] dark:text-white mb-1">
              {_statisticsSummary.totalUsers.toLocaleString()}
            </h4>
            <span className="text-sm font-medium text-success">
              ↑ {_statisticsSummary.newUsers} مستخدم جديد
            </span>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-6">
            <span className="block text-sm font-medium text-grey-600 dark:text-grey-500 mb-2">
              إجمالي الطلبات
            </span>
            <h4 className="text-xl md:text-2xl font-bold text-[#263238] dark:text-white mb-1">
              {_statisticsSummary.totalOrders.toLocaleString()}
            </h4>
            <span className="text-sm font-medium text-success">
              {((_statisticsSummary.completedOrders / _statisticsSummary.totalOrders) * 100).toFixed(1)}% مكتمل
            </span>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-6">
            <span className="block text-sm font-medium text-grey-600 dark:text-grey-500 mb-2">
              إجمالي الإيرادات
            </span>
            <h4 className="text-xl md:text-2xl font-bold text-[#263238] dark:text-white mb-1">
              {_financialSummary.totalRevenue.toLocaleString()} ريال
            </h4>
            <span className="text-sm font-medium text-success">
              ↑ نمو إيجابي
            </span>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-6">
            <span className="block text-sm font-medium text-grey-600 dark:text-grey-500 mb-2">
              صافي الربح
            </span>
            <h4 className="text-xl md:text-2xl font-bold text-success mb-1">
              {_financialSummary.netProfit.toLocaleString()} ريال
            </h4>
            <span className="text-sm font-medium text-grey-600 dark:text-grey-500">
              {_financialSummary.profitMargin}% نسبة الربح
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-6">
            <SimpleChart />
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-6">
            <h3 className="text-sm font-semibold text-[#263238] dark:text-white mb-4">
              حالة الطلبات
            </h3>
            <div className="space-y-4">
              {_orderStatusReport.map((item, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[#263238] dark:text-white">{item.status}</span>
                    <span className="text-sm font-bold text-[#263238] dark:text-white">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e0e0e0] dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${(item.value / _statisticsSummary.totalOrders) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* 
        <div className="col-span-12">
          <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark p-6">
            <h3 className="text-sm font-semibold text-[#263238] dark:text-white mb-4">
              روابط سريعة
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link 
                href={paths.dashboard.users.list}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-bold shadow-sm transition-colors duration-200 no-underline"
              >
                إدارة المستخدمين
              </Link>
              <Link 
                href={paths.dashboard.commissions.list}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-solid border-grey-300 dark:border-grey-700 hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-800 dark:text-white text-sm font-semibold transition-colors duration-200 no-underline"
              >
                العمولات
              </Link>
              <Link 
                href={paths.dashboard.reports.list}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-solid border-grey-300 dark:border-grey-700 hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-800 dark:text-white text-sm font-semibold transition-colors duration-200 no-underline"
              >
                التقارير
              </Link>
              <Link 
                href={paths.dashboard.financial.list}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-solid border-grey-300 dark:border-grey-700 hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-800 dark:text-white text-sm font-semibold transition-colors duration-200 no-underline"
              >
                الماليات
              </Link>
              <Link 
                href={paths.dashboard.messages.list}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-solid border-grey-300 dark:border-grey-700 hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-800 dark:text-white text-sm font-semibold transition-colors duration-200 no-underline"
              >
                الرسائل
              </Link>
              <Link 
                href={paths.dashboard.notifications.list}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-solid border-grey-300 dark:border-grey-700 hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-800 dark:text-white text-sm font-semibold transition-colors duration-200 no-underline"
              >
                الإشعارات
              </Link>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
