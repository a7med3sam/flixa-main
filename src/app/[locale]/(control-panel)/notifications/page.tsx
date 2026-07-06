import NotificationsListView from 'src/sections/notifications/notifications-list-view';
import PermissionGuard from 'src/auth/guard/permission-guard';

export default function NotificationsPage() {
  return (
    <PermissionGuard permissions={['Notifications.List', 'Notifications.Send']}>
      <NotificationsListView />
    </PermissionGuard>
  );
}
