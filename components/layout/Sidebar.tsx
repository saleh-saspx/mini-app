'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Home, UserRound, Wallet, Package, UserCircle2 } from 'lucide-react';

const navItems = [
  { href: '/', label: 'خانه', icon: Home },
  { href: '/accounts', label: 'اکانت‌ها', icon: UserRound },
  { href: '/wallets', label: 'کیف پول‌ها', icon: Wallet },
  { href: '/packages', label: 'پلن‌ها', icon: Package },
  { href: '/profile', label: 'پروفایل', icon: UserCircle2 }
];

export default function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 right-0 z-40 w-64 transform border-l border-slate-200 bg-white p-4 transition-transform lg:translate-x-0',
        open ? 'translate-x-0' : 'translate-x-full',
        'text-right'
      )}
    >
      {/* Logo / Title */}
      <h1 className="mb-6 px-2 text-xl font-bold text-brand-700">MiniApp مدیریت</h1>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
              'flex-row-reverse',
              pathname === href
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}