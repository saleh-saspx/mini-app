'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Pagination from '@/components/ui/Pagination';
import api from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useAuth } from '@/context/AuthContext';
import type { Account } from '@/types';

const PAGE_SIZE = 8;

export default function AccountsPage() {
  const { username } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [newAccount, setNewAccount] = useState({ username: '', password: '', subscription: '' });
  const [planByUser, setPlanByUser] = useState<Record<string, string>>({});
  const [passwordByUser, setPasswordByUser] = useState<Record<string, string>>({});
  const [terminateUser, setTerminateUser] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (!username) return;
    try {
      setLoading(true);
      const { data } = await api.get<Account[] | { data: Account[] }>(`/mini-app/account/${username}`);
      const rows = Array.isArray(data) ? data : data.data || [];
      setAccounts(rows);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load accounts'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAccounts();
  }, [username]);

  const filteredAccounts = useMemo(
    () => accounts.filter((item) => item.username.toLowerCase().includes(search.toLowerCase())),
    [accounts, search]
  );

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const paginatedAccounts = filteredAccounts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const createAccount = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAccount.username || !newAccount.password || !newAccount.subscription) {
      toast.error('All fields are required to create account.');
      return;
    }

    try {
      setProcessing(true);
      await api.post('/mini-app/store', newAccount);
      toast.success('Account created successfully.');
      setNewAccount({ username: '', password: '', subscription: '' });
      await fetchAccounts();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Create account failed'));
    } finally {
      setProcessing(false);
    }
  };

  const updatePlan = async (targetUsername: string) => {
    const subscription = planByUser[targetUsername];
    if (!subscription) return toast.error('Enter new subscription plan first.');

    try {
      setProcessing(true);
      await api.post(`/mini-app/account/${targetUsername}/plan`, { subscription });
      toast.success(`Plan updated for ${targetUsername}.`);
      await fetchAccounts();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update plan'));
    } finally {
      setProcessing(false);
    }
  };

  const updatePassword = async (targetUsername: string) => {
    const password = passwordByUser[targetUsername];
    if (!password) return toast.error('Enter a new password first.');

    try {
      setProcessing(true);
      await api.post(`/mini-app/account/${targetUsername}/password`, { password });
      toast.success(`Password updated for ${targetUsername}.`);
      setPasswordByUser((prev) => ({ ...prev, [targetUsername]: '' }));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update password'));
    } finally {
      setProcessing(false);
    }
  };

  const confirmTerminate = async () => {
    if (!terminateUser) return;

    try {
      setProcessing(true);
      await api.post(`/mini-app/account/${terminateUser}/terminate`);
      toast.success(`Account ${terminateUser} terminated.`);
      setTerminateUser(null);
      await fetchAccounts();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to terminate account'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card title="Create Account">
          <form onSubmit={createAccount} className="grid gap-3 md:grid-cols-4">
            <input
              placeholder="username"
              value={newAccount.username}
              onChange={(e) => setNewAccount((prev) => ({ ...prev, username: e.target.value }))}
            />
            <input
              placeholder="password"
              type="password"
              value={newAccount.password}
              onChange={(e) => setNewAccount((prev) => ({ ...prev, password: e.target.value }))}
            />
            <input
              placeholder="subscription"
              value={newAccount.subscription}
              onChange={(e) => setNewAccount((prev) => ({ ...prev, subscription: e.target.value }))}
            />
            <Button type="submit" disabled={processing}>
              Create
            </Button>
          </form>
        </Card>

        <Card title="Accounts" action={<input placeholder="Search username..." value={search} onChange={(e) => setSearch(e.target.value)} />}>
          {loading ? (
            <p className="text-sm text-slate-500">Loading accounts...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2">Username</th>
                    <th className="py-2">Subscription</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAccounts.map((account) => (
                    <tr key={account.username} className="border-b align-top">
                      <td className="py-3 pr-3 font-medium">{account.username}</td>
                      <td className="py-3 pr-3">{account.subscription}</td>
                      <td className="py-3 pr-3">{account.status ?? 'active'}</td>
                      <td className="space-y-2 py-3">
                        <div className="flex flex-wrap gap-2">
                          <input
                            className="w-40"
                            placeholder="new subscription"
                            value={planByUser[account.username] ?? ''}
                            onChange={(e) =>
                              setPlanByUser((prev) => ({ ...prev, [account.username]: e.target.value }))
                            }
                          />
                          <Button
                            variant="secondary"
                            disabled={processing}
                            onClick={() => updatePlan(account.username)}
                          >
                            Update Plan
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <input
                            className="w-40"
                            placeholder="new password"
                            type="password"
                            value={passwordByUser[account.username] ?? ''}
                            onChange={(e) =>
                              setPasswordByUser((prev) => ({ ...prev, [account.username]: e.target.value }))
                            }
                          />
                          <Button
                            variant="secondary"
                            disabled={processing}
                            onClick={() => updatePassword(account.username)}
                          >
                            Update Password
                          </Button>
                          <Button
                            variant="danger"
                            disabled={processing}
                            onClick={() => setTerminateUser(account.username)}
                          >
                            Terminate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </Card>
      </div>

      <ConfirmationModal
        open={Boolean(terminateUser)}
        title="Terminate account"
        description={`Are you sure you want to terminate ${terminateUser}? This action cannot be undone.`}
        confirmText="Terminate"
        onCancel={() => setTerminateUser(null)}
        onConfirm={confirmTerminate}
        loading={processing}
      />
    </DashboardLayout>
  );
}
