'use client';

import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/errors';
import { CheckCircle, XCircle, Pause } from 'lucide-react';

export default function ProfilePage() {
  const { username, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  // گرفتن اطلاعات کاربر از API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await api.get('/me');
        setProfile(res.data.profile);
        setSubscriptions(res.data.subscriptions);
        setWallet(res.data.wallet);
      } catch (error) {
        toast.error(getErrorMessage(error, 'خطا در دریافت اطلاعات کاربر'));
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const updatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('رمز عبور نمی‌تواند خالی باشد.');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/account/${username}/password`, { password });
      toast.success('رمز عبور با موفقیت تغییر کرد.');
      setPassword('');
    } catch (error) {
      toast.error(getErrorMessage(error, 'خطا در تغییر رمز عبور'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !profile || !subscriptions || !wallet) {
    return (
      <DashboardLayout>
        <div className="text-center text-slate-600 py-20">در حال بارگذاری اطلاعات...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-8 lg:grid-cols-1 text-right">

        {/* مشخصات حساب کاربری */}
        <Card title="📝 مشخصات حساب کاربری">
          <div className="space-y-2 text-sm text-slate-700">
            <p>👤 نام: <span className="font-medium">{profile.name}</span></p>
            <p>💻 نام کاربری: <span className="font-medium">{profile.username}</span></p>
            <p>🆔 شناسه کاربری: <span className="font-medium">{profile.userId}</span></p>
            <p>📌 وضعیت حساب:
              <span className={`font-medium ml-1 ${profile.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {profile.status === 'active' ? '🟢 فعال' : '🔴 غیرفعال'}
              </span>
            </p>
            <p>📅 تاریخ ثبت‌نام: <span className="font-medium">{profile.registeredAt}</span></p>
          </div>
        </Card>

        {/* گزارش اشتراک‌ها */}
        <Card title="📊 گزارش اشتراک‌ها">
          <div className="flex flex-col gap-2 text-sm text-slate-700">
            <p className="text-green-600 flex items-center gap-1">
              <CheckCircle size={16} /> فعال: {subscriptions.active} اکانت
            </p>
            <p className="text-red-600 flex items-center gap-1">
              <XCircle size={16} /> غیرفعال: {subscriptions.inactive} اکانت
            </p>
            <p className="text-yellow-600 flex items-center gap-1">
              <Pause size={16} /> معلق: {subscriptions.paused} اکانت
            </p>
          </div>
        </Card>

        {/* گزارش کیف پول */}
        <Card title="💰 گزارش کیف پول">
          <div className="flex flex-col gap-2 text-sm text-slate-700">
            <p>⬆️ واریز: {wallet.depositCount} تراکنش | جمع: {wallet.depositTotal.toLocaleString()} ریال</p>
            <p>⬇️ برداشت: {wallet.withdrawCount} تراکنش | جمع: {wallet.withdrawTotal.toLocaleString()} ریال</p>
          </div>
        </Card>



      </div>
    </DashboardLayout>
  );
}