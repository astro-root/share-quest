import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
export const metadata: Metadata = { title: 'スタッフログイン' };
export default function WriterLoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold text-blue-800">SHARE Quest</h1>
        <p className="text-xs text-gray-400 mt-1">スタッフログイン（ライター・編集長専用）</p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
