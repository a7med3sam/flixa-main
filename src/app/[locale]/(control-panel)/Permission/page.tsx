// import UsersListView from 'src/sections/users/users-list-view';

// export default function UsersPage() {
//   return <UsersListView />;
// }
import { notFound } from 'next/navigation';

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

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  // const response = await getEmployeeByIdAction(id);
  const permissionsRes = await getPermissionsAction();

  const permissions =
    permissionsRes.success && permissionsRes.data?.items ? permissionsRes.data.items : [];

  const userId = '60c7037c-153c-4e2b-a9fc-26ef5534aa5f';

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
