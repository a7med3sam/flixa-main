import {
  getPermissionsAction,
  getUserPermissionsAction,
  PermissionItem,
} from 'src/actions/permissions';
import EmployeePowers from 'src/sections/Permission/employee-powers';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EmployeePermissionPage({ params }: PageProps) {
  const { id: userId } = await params;
  const permissionsRes = await getPermissionsAction();

  const permissions =
    permissionsRes.success && permissionsRes.data?.items ? permissionsRes.data.items : [];

  const userPermissionsRes = userId ? await getUserPermissionsAction(userId) : null;

  const flattenIds = (items: PermissionItem[] = []): string[] =>
    items.flatMap((p) => [p.id, ...(p.children ? flattenIds(p.children) : [])]);

  const initialPermissionIds = flattenIds(
    userPermissionsRes?.success ? (userPermissionsRes.data.items ?? []) : []
  );

  return (
    <EmployeePowers
      permissions={permissions}
      userId={userId}
      initialPermissionIds={initialPermissionIds}
    />
  );
}
