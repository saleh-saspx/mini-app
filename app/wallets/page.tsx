'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import api from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Wallet } from '@/types';

const PAGE_SIZE = 10;

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const { data } = await api.get<Wallet[] | { data: Wallet[] }>('/mini-app/wallets');
        setWallets(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load wallets'));
      }
    };

    void loadWallets();
  }, []);

  const totalBalance = useMemo(
    () => wallets.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0),
    [wallets]
  );
  const totalPages = Math.max(1, Math.ceil(wallets.length / PAGE_SIZE));
  const paged = wallets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <Card title="Wallets" action={<p className="text-sm text-slate-600">Total: {totalBalance.toLocaleString()}</p>}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">Member ID</th>
                <th className="py-2">Type</th>
                <th className="py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((wallet) => (
                <tr key={wallet.id} className="border-b">
                  <td className="py-2">{wallet.member_id}</td>
                  <td className="py-2">{wallet.type}</td>
                  <td className="py-2">{Number(wallet.balance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </DashboardLayout>
  );
}
