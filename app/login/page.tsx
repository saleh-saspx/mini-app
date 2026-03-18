
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function TelegramLoginPage() {
  const [telegramId, setTelegramId] = useState('');
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE_URL) {
      toast.error('API base URL not configured in env.');
      return;
    }
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg) {
      setIsTelegram(true);
      const user = tg.initDataUnsafe?.user;
      if (user?.id) {
        setTelegramId(user.id.toString());

        // ارسال به سرور
    fetch(`${API_BASE_URL}/telegram-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegram_id: user.id, username: user.username }),
        })
          .then(() => toast.success('User info sent to admin'))
          .catch(() => toast.error('Failed to send user info'));
      } else {
        toast.error('Failed to get Telegram user info.');
      }
    }
  }, []);

  const handleDebugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId) {
      toast.error('Please enter Telegram ID.');
      return;
    }
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE_URL) {
      toast.error('API base URL not configured in env.');
      return;
    }
    fetch(`${API_BASE_URL}/telegram-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: telegramId, username: 'debug_user' }),
    })
      .then(() => toast.success('Debug ID sent to admin'))
      .catch(() => toast.error('Failed to send debug ID'));
  };

  // اگر تو تلگرام هست، فقط پیام بفرستیم، فرم لازم نیست
  if (isTelegram) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-lg font-medium">Logged in with Telegram ID: {telegramId}</p>
      </div>
    );
  }

  // حالت دیباگ: فرم برای وارد کردن دستی شناسه
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleDebugSubmit} className="w-[320px] space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Telegram ID (debug)</label>
          <input
            className="w-full border p-2 rounded"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Send Debug ID
        </button>
      </form>
    </div>
  );
}

