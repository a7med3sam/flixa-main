import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { Report, ReportOrder } from 'src/types/report';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import { PaymentMethodsApiResponse } from 'src/types/order';
import ReportsView from 'src/sections/reports/views/list-view';
import {
  _reportOrders,
  _reportsSummary,
  _reportPaymentMethods,
} from 'src/_mock/_dashboard-reports';

interface Props {
  searchParams: Promise<
    Record<
      | 'page'
      | 'limit'
      | 'PaymentMethodName'
      | 'RegistrationDate'
      | 'OrderNumber'
      | 'StartDate'
      | 'EndDate',
      string | undefined
    >
  >;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, PaymentMethodName, RegistrationDate, OrderNumber, StartDate, EndDate } =
    await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    PaymentMethodName: PaymentMethodName || '',
    RegistrationDate: RegistrationDate || '',
    OrderNumber: OrderNumber || '',
    StartDate: StartDate || '',
    EndDate: EndDate || '',
  });

  const reports = await getData<Report>(
    `${endpoints.reports.listReports}?${urlSearchParams.toString()}`
  );
  const orderReportsList = await getData<{ totalCount: number; items: ReportOrder[] }>(
    `${endpoints.reports.ListOrderReports}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.ReportsOrdrersList] }
  );

  if ('error' in orderReportsList) {
    if (orderReportsList.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(orderReportsList.error);
  }
  const paymentMethodItems = await getData<PaymentMethodsApiResponse>(
    `${endpoints.paynentMethod.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.PaymentMethod] }
  );

  if ('error' in paymentMethodItems) {
    if (paymentMethodItems.status === 403) {
      return <NoPermissionView />;
    }
    throw new Error(paymentMethodItems.error);
  }
  const fallbackOrderReports = orderReportsList?.data?.items?.length
    ? orderReportsList.data.items
    : _reportOrders;
  const fallbackTotalCount = orderReportsList?.data?.totalCount || fallbackOrderReports.length;
  const reportData: Report | null =
    reports && 'data' in reports && reports.data ? (reports.data as Report) : null;
  const fallbackReports = {
    totalSales:
      typeof reportData?.totalSales === 'number'
        ? reportData.totalSales
        : _reportsSummary.totalSales,
    deliveryFees:
      typeof reportData?.deliveryFees === 'number'
        ? reportData.deliveryFees
        : _reportsSummary.deliveryFees,
    valueAddedTax:
      typeof reportData?.valueAddedTax === 'number'
        ? reportData.valueAddedTax
        : _reportsSummary.valueAddedTax,
    discounts:
      typeof reportData?.discounts === 'number' ? reportData.discounts : _reportsSummary.discounts,
    netRevenue:
      typeof reportData?.netRevenue === 'number'
        ? reportData.netRevenue
        : _reportsSummary.netRevenue,
  };
  const fallbackPaymentMethods = paymentMethodItems?.data?.data?.items?.length
    ? paymentMethodItems.data.data.items
    : _reportPaymentMethods;

  return (
    <ReportsView
      orderReports={fallbackOrderReports}
      totalCount={fallbackTotalCount}
      reports={fallbackReports as Report}
      paymentMethod={fallbackPaymentMethods}
    />
  );
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Reports' });

  return {
    title: t('title'),
  };
}
