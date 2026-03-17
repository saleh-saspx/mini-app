'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import RequireAuth from '@/components/layout/RequireAuth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RequireAuth>
        {children}
        <Toaster position="top-right" />
      </RequireAuth>
    </AuthProvider>
  );
}
