'use client';

import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/errors';

export default function ProfilePage() {
  const { username, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const updatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Password cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/mini-app/account/${username}/password`, { password });
      toast.success('Password updated successfully.');
      setPassword('');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile Info">
          <p className="text-sm text-slate-500">Username</p>
          <p className="text-xl font-semibold">{username}</p>
        </Card>

        <Card title="Security">
          <form onSubmit={updatePassword} className="space-y-3">
            <label className="block text-sm font-medium">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                Update Password
              </Button>
              <Button type="button" variant="secondary" onClick={logout}>
                Logout
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
