'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
    if (!loading && isAuthenticated && pathname === '/login') {
      router.push('/');
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading session...</div>;
  if (!isAuthenticated && pathname !== '/login') return null;
  return <>{children}</>;
}
