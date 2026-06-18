import { endpoints } from 'src/utils/endpoints';
import { getData } from 'src/utils/crud-fetch-api';
import { getTranslations } from 'next-intl/server';
import { NoPermissionView } from 'src/sections/error';
import { Report, ReportOrder } from 'src/types/report';
import { FetchTags } from 'src/actions/config-actions';
import { DEFAULT_LIMIT } from 'src/components/constant';
import { PaymentMethodsApiResponse } from 'src/types/order';
import ReportsView from 'src/sections/reports/views/list-view';

interface Props {
  searchParams: Promise<
    Record<'page' | 'limit' | 'PaymentMethodName' | 'RegistrationDate'|'OrderNumber'|'StartDate'|'EndDate', string | undefined>
  >;
}

export default async function Page({ searchParams }: Props) {
  let { page, limit, PaymentMethodName, RegistrationDate,OrderNumber,StartDate,EndDate } = await searchParams;

  const urlSearchParams = new URLSearchParams({
    page: page || '1',
    limit: limit || `${DEFAULT_LIMIT}`,
    PaymentMethodName: PaymentMethodName || '',
    RegistrationDate: RegistrationDate || '',
    OrderNumber: OrderNumber || '',
    StartDate: StartDate||'',
    EndDate: EndDate||'',

  });

  const reports = await getData<Report>( `${endpoints.reports.listReports}?${urlSearchParams.toString()}`);
  const orderReportsList = await getData<{ totalCount: number; items: ReportOrder[] }>(
    `${endpoints.reports.ListOrderReports}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.ReportsOrdrersList] }
  );

  if ('error' in orderReportsList) {
    if(orderReportsList.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(orderReportsList.error);
  }
  const paymentMethodItems = await getData<PaymentMethodsApiResponse>(
    `${endpoints.paynentMethod.list}?${urlSearchParams.toString()}`,
    { tags: [FetchTags.PaymentMethod] }
  );

  if ('error' in paymentMethodItems) {
   if(paymentMethodItems.status === 403) {
    return <NoPermissionView />;
  }
    throw new Error(paymentMethodItems.error);
  }
  return (
    <ReportsView
      orderReports={orderReportsList?.data?.items}
      totalCount={orderReportsList?.data?.totalCount}
      reports={reports?.data as Report}
      paymentMethod={paymentMethodItems?.data?.data?.items}

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
