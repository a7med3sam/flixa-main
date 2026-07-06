'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from 'src/auth/auth-store';

type PermissionGuardProps = {
  permissions: string[];
  children: React.ReactNode;
};

export default function PermissionGuard({ permissions, children }: PermissionGuardProps) {
  const { user } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user has ADMIN role or explicitly holds any of the required permissions
      const isSuperAdmin = user.role === 'ADMIN' || user.role === 'Admin'; 
      const userPermissions = user.permissions || [];
      const isAllowed = isSuperAdmin || permissions.some((p) => userPermissions.includes(p));

      setHasPermission(isAllowed);
      setHasChecked(true);

      if (!isAllowed) {
        window.dispatchEvent(new Event('forbidden_error'));
      }
    }
  }, [user, permissions]);

  // Optionally render a small loading or null while checking
  if (!hasChecked) {
    return null;
  }

  if (!hasPermission) {
    return null; // The global forbidden banner will show above
  }

  return <>{children}</>;
}
