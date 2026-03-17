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

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const { data } = await api.get<Package[] | { data: Package[] }>('/mini-app/packages');
        setPackages(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load packages'));
      }
    };

    void loadPackages();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="mb-4 text-2xl font-bold">Subscription Packages</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} title={pkg.name}>
            <p className="text-2xl font-bold text-brand-700">{Number(pkg.price).toLocaleString()}</p>
            <p className="mt-2 text-sm text-slate-500">{pkg.duration ?? 'Flexible duration'}</p>
            <p className="mt-3 text-sm text-slate-600">{pkg.description ?? 'No description provided.'}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
