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
  const [walletCount, setWalletCount] = useState(0);
  const [walletTotal, setWalletTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      try {
        const [accountsRes, walletsRes] = await Promise.all([
          api.get<Account[] | { data: Account[] }>(`/mini-app/account/${username}`),
          api.get<Wallet[] | { data: Wallet[] }>('/mini-app/wallets')
        ]);

        const accounts = Array.isArray(accountsRes.data) ? accountsRes.data : accountsRes.data.data || [];
        const wallets = Array.isArray(walletsRes.data) ? walletsRes.data : walletsRes.data.data || [];

        setAccountsCount(accounts.length);
        setWalletCount(wallets.length);
        setWalletTotal(wallets.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0));
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load dashboard analytics'));
      }
    };

    void load();
  }, [username]);

  return (
    <DashboardLayout>
      <h2 className="mb-6 text-2xl font-bold">Dashboard Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Accounts">
          <p className="text-3xl font-bold text-brand-700">{accountsCount}</p>
        </Card>
        <Card title="Wallets">
          <p className="text-3xl font-bold text-brand-700">{walletCount}</p>
        </Card>
        <Card title="Total Wallet Balance">
          <p className="text-3xl font-bold text-brand-700">{walletTotal.toLocaleString()}</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
