import ContentEditView from 'src/sections/content/content-edit-view';
import PermissionGuard from 'src/auth/guard/permission-guard';

export default function PrivacyPolicyPage() {
  return (
    <PermissionGuard permissions={['Pages.View', 'Pages.Update']}>
      <ContentEditView slug="privacy-policy" />
    </PermissionGuard>
  );
}
