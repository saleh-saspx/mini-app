'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/errors';
import type { Account, Wallet } from '@/types';

export default function HomePage() {
  const { username } = useAuth();
  const [accountsCount, setAccountsCount] = useState(0);
  const [walletTotal, setWalletTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      try {
        const [accountsRes, walletsRes] = await Promise.all([
          api.get<Account[] | { data: Account[] }>(`/account/${username}`),
          api.get<Wallet[] | { data: Wallet[] }>('/wallets')
        ]);

        const accounts = Array.isArray(accountsRes.data)
          ? accountsRes.data
          : accountsRes.data.data || [];

        const wallets = Array.isArray(walletsRes.data)
          ? walletsRes.data
          : walletsRes.data.data || [];

        setAccountsCount(accounts.length);
        setWalletTotal(
          wallets.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0)
        );
      } catch (error) {
        toast.error(getErrorMessage(error, 'خطا در دریافت اطلاعات داشبورد'));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [username]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 text-right">
        <h2 className="text-2xl font-bold">نمای کلی داشبورد</h2>
        <p className="text-sm text-slate-500 mt-1">
          وضعیت کلی حساب‌ها و کیف پول‌ها
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-1/2 bg-slate-200 rounded ml-auto" />
                <div className="h-6 w-1/3 bg-slate-300 rounded ml-auto" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="تعداد اکانت‌ها">
            <p className="text-3xl font-bold text-brand-700 text-right">
              {accountsCount}
            </p>
          </Card>


          <Card title="موجودی کل کیف پول‌ها">
            <p className="text-3xl font-bold text-brand-700 text-right">
              {walletTotal.toLocaleString()}
              <span className="text-sm text-slate-500 mr-1">ریال</span>
            </p>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}