'use client';

import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/errors';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Username and password are required.');
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      toast.success('Login successful.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card title="Sign in to MiniApp Dashboard">
        <form onSubmit={onSubmit} className="w-[320px] space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
