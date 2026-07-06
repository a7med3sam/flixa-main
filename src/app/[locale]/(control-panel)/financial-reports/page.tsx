import FinancialListView from 'src/sections/financial/financial-list-view';
import PermissionGuard from 'src/auth/guard/permission-guard';

export default function FinancialPage() {
  return (
    <PermissionGuard permissions={['Reports.View', 'Financial.View']}>
      <FinancialListView />
    </PermissionGuard>
  );
}
