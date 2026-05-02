'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!name || !email || !message) return;
    setStatus('sending');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      setStatus('success');
      setName(''); setEmail(''); setMessage('');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">お問い合わせ</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">ご質問・ご意見などをお気軽にどうぞ。</p>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">お名前 <span className="text-red-500">*</span></label>
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="山田 太郎"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">メールアドレス <span className="text-red-500">*</span></label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">お問い合わせ内容 <span className="text-red-500">*</span></label>
          <textarea
            value={message} onChange={e => setMessage(e.target.value)} rows={6}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="お問い合わせ内容をご記入ください"
          />
        </div>

        {status === 'success' && (
          <p className="text-sm text-green-600 dark:text-green-400">✅ 送信しました。お返事をお待ちください。</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-500">送信に失敗しました。時間をおいて再度お試しください。</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={status === 'sending' || !name || !email || !message}
          className="self-start px-6 py-2 rounded-full bg-[#0f1f3d] hover:bg-[#1a3460] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? '送信中...' : '送信する'}
        </button>
      </div>
    </div>
  );
}
