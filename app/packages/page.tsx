'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import api from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Package } from '@/types';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Package | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const generateRandom = () => {
    const rand = Math.random().toString(36).slice(2, 8);
    setUsername(`mau-${rand}`);
    setPassword(Math.random().toString(36).slice(2, 10));
  };

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const { data } = await api.get<Package[] | { data: Package[] }>('/packages');

        const parsed = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.packages)
          ? (data as any).packages
          : [];

        setPackages(parsed);
      } catch (error) {
        toast.error(getErrorMessage(error, 'خطا در دریافت پکیج‌ها'));
      } finally {
        setLoading(false);
      }
    };

    void loadPackages();
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">پلن‌های اشتراک</h2>
        <p className="text-sm text-slate-500 mt-1">
          پلن مناسب خودت رو انتخاب کن و هر زمان ارتقا بده.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="h-6 w-1/3 bg-slate-300 rounded" />
                <div className="h-3 w-2/3 bg-slate-200 rounded" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && packages.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          هیچ پکیجی موجود نیست.
        </div>
      )}

      {/* Packages */}
      {!loading && packages.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.key} className="hover:shadow-lg transition rounded-2xl">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">{pkg.name}</h3>

                <p className="text-3xl font-bold text-brand-700">
                  {Number(pkg.price).toLocaleString()}
                  <span className="text-sm text-slate-500 ml-1">ریال</span>
                </p>

                <div className="text-sm text-slate-600 space-y-1">
                  <p>
                    ⏱ مدت: <span className="font-medium">{pkg.time ? `${pkg.time} روز` : 'انعطاف‌پذیر'}</span>
                  </p>

                  <p>
                    💾 حجم: <span className="font-medium">{pkg.size ? `${pkg.size} گیگ` : 'نامحدود'}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelected(pkg)}
                  className="mt-4 w-full bg-red-600 hover:bg-blue-600 text-white text-sm py-2 rounded-xl transition"
                >
                  انتخاب پلن
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">ثبت سفارش</h3>

            <div className="mb-4 text-sm text-slate-600">
              <p>پلن: {selected.name}</p>
              <p>قیمت: {Number(selected.price).toLocaleString()} ریال</p>
            </div>

            <div className="space-y-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.startsWith('mau-') ? e.target.value : `mau-${e.target.value}`)}
                placeholder="username"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full border rounded-lg px-3 py-2"
              />

              <button
                onClick={generateRandom}
                className="w-full bg-slate-200 hover:bg-slate-300 py-2 rounded-lg text-sm"
              >
                تولید مقدار تصادفی
              </button>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-slate-200 py-2 rounded-lg"
              >
                انصراف
              </button>

              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                ثبت نهایی
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
