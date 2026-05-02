import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'スタッフログイン' };

export default function WriterLoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-2">スタッフログイン</h1>
      <p className="text-sm text-gray-400 mb-6">ライター・編集長専用ページです</p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
