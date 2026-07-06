import ContentEditView from 'src/sections/content/content-edit-view';
import PermissionGuard from 'src/auth/guard/permission-guard';

export default function AboutUsPage() {
  return (
    <PermissionGuard permissions={['Pages.View', 'Pages.Update']}>
      <ContentEditView slug="about-us" />
    </PermissionGuard>
  );
}
