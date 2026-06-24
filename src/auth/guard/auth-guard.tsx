'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useAuthStore } from 'src/auth/auth-store';
import { paths } from 'src/routes/paths';

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { authenticated, loading, init } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    init().then(() => setIsChecking(false));
  }, [init]);

  useEffect(() => {
    if (!loading && !isChecking && !authenticated) {
      router.replace(paths.auth.login);
    }
  }, [authenticated, loading, isChecking, router]);

  if (loading || isChecking) {
    return null; // We can replace this with a SplashScreen or loading spinner later
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
