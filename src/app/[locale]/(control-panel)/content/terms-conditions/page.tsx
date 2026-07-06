import ContentEditView from 'src/sections/content/content-edit-view';
import PermissionGuard from 'src/auth/guard/permission-guard';

export default function TermsConditionsPage() {
  return (
    <PermissionGuard permissions={['Pages.View', 'Pages.Update']}>
      <ContentEditView slug="terms-conditions" />
    </PermissionGuard>
  );
}
