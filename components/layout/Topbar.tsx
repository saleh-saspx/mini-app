'use client';

import { Menu, LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { username, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
      <Button variant="secondary" className="lg:hidden" onClick={onMenuClick}>
        <Menu size={16} />
      </Button>
      <div className="ml-auto flex items-center gap-3">
        <p className="text-sm text-slate-600">Signed in as {username ?? 'user'}</p>
        <Button variant="secondary" onClick={logout}>
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  );
}
