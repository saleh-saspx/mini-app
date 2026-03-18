'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/errors';
import { Copy, Trash2, Edit3, Key, CheckCircle, XCircle, Pause } from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import type { Account } from '@/types';

export default function AccountsPage() {
  const { username } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [actionUser, setActionUser] = useState<{ type: 'plan' | 'password' | 'terminate', username: string } | null>(null);
  const [planByUser, setPlanByUser] = useState<Record<string, string>>({});
  const [passwordByUser, setPasswordByUser] = useState<Record<string, string>>({});

  const fetchAccounts = async () => {
    if (!username) return;
    try {
      setLoading(true);
      const { data } = await api.get<Account[] | { accounts: Account[] }>(`/accounts`);
      setAccounts(Array.isArray(data) ? data : data.accounts || []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'بارگذاری اکانت‌ها با خطا مواجه شد'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAccounts();
  }, [username]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} کپی شد`);
  };

  const handleActionConfirm = async () => {
    if (!actionUser) return;
    setProcessing(true);
    try {
      const { username, type } = actionUser;
      if (type === 'plan') {
        const subscription = planByUser[username];
        if (!subscription) throw new Error('پلن جدید وارد نشده');
        await api.post(`/account/${username}/plan`, { subscription });
        toast.success(`پلن اکانت ${username} بروزرسانی شد`);
      }
      if (type === 'password') {
        const password = passwordByUser[username];
        if (!password) throw new Error('رمز عبور جدید وارد نشده');
        await api.post(`/account/${username}/password`, { password });
        toast.success(`رمز عبور ${username} بروزرسانی شد`);
        setPasswordByUser((prev) => ({ ...prev, [username]: '' }));
      }
      if (type === 'terminate') {
        await api.post(`/account/${username}/terminate`);
        toast.success(`اکانت ${username} حذف شد`);
      }
      await fetchAccounts();
    } catch (error) {
      toast.error(getErrorMessage(error, 'عملیات با خطا مواجه شد'));
    } finally {
      setProcessing(false);
      setActionUser(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 text-right">

        {loading ? (
          <p className="text-gray-500 text-center">در حال بارگذاری اکانت‌ها...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {accounts.map(account => (
              <Card key={account.username} className="flex flex-col justify-between p-4 gap-1 relative">
                <div className="flex flex-col gap-1">
  
           <div className="flex flex-col gap-1">
                  {/* Username */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{account.username}</span>
                    <Copy
                      className="cursor-pointer text-gray-400 hover:text-gray-700"
                      size={16}
                      onClick={() => copyToClipboard(account.username, 'نام کاربری')}
                    />
                  </div>

                  {/* Password */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{account.password}</span>
                    <Copy
                      className="cursor-pointer text-gray-400 hover:text-gray-700"
                      size={16}
                      onClick={() => copyToClipboard(account.password, 'رمز عبور')}
                    />
                  </div>

                  {/* Subscription */}
                  <div className="text-sm text-gray-700">اشتراک: {account.subscription}</div>

                  {/* Server */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>سرور: {account.server}</span>
                    <Copy
                      className="cursor-pointer text-gray-400 hover:text-gray-700"
                      size={14}
                      onClick={() => copyToClipboard(account.server, 'سرور')}
                    />
                  </div>

                  {/* Secret */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>کد سکرت : {account.secret}</span>
                    <Copy
                      className="cursor-pointer text-gray-400 hover:text-gray-700"
                      size={14}
                      onClick={() => copyToClipboard(account.secret, 'Secret')}
                    />
                  </div>

                  {/* Size */}
                  <div className="text-sm text-gray-600">حجم: {account.size}</div>

                  {/* Time */}
                  <div className="text-sm text-gray-600">ثبت شده در: {account.time}</div>

                  {/* Status */}
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    {account.status === 'active' && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16}/> فعال</span>}
                    {account.status === 'paused' && <span className="text-yellow-600 flex items-center gap-1"><Pause size={16}/> معلق</span>}
                    {account.status === 'inactive' && <span className="text-red-600 flex items-center gap-1"><XCircle size={16}/> غیرفعال</span>}
                  </div>
                </div>

                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    title="بروزرسانی پلن"
                    onClick={() => setActionUser({ username: account.username, type: 'plan' })}
                  ><Edit3 size={18} /></button>

                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    title="بروزرسانی رمز عبور"
                    onClick={() => setActionUser({ username: account.username, type: 'password' })}
                  ><Key size={18} /></button>

                  <button
                    className="p-2 rounded hover:bg-red-100 text-red-600"
                    title="حذف اکانت"
                    onClick={() => setActionUser({ username: account.username, type: 'terminate' })}
                  ><Trash2 size={18} /></button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <ConfirmationModal
          open={!!actionUser}
          title={
            actionUser?.type === 'terminate' ? 'حذف اکانت' :
            actionUser?.type === 'plan' ? 'بروزرسانی پلن' :
            'بروزرسانی رمز عبور'
          }
          description={
            actionUser?.type === 'terminate'
              ? `آیا مطمئن هستید که می‌خواهید اکانت ${actionUser?.username ?? ''} را حذف کنید؟ این عملیات قابل بازگشت نیست.`
              : actionUser?.type === 'plan'
              ? `پلن جدید برای اکانت ${actionUser?.username ?? ''} وارد کنید و تایید کنید.`
              : `رمز عبور جدید برای اکانت ${actionUser?.username ?? ''} وارد کنید و تایید کنید.`
          }
          confirmText={actionUser?.type === 'terminate' ? 'حذف اکانت' : 'تایید'}
          onCancel={() => setActionUser(null)}
          onConfirm={handleActionConfirm}
          loading={processing}
        />

      </div>
    </DashboardLayout>
  );
}