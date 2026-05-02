import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TabSwitcher } from '@/components/auth/TabSwitcher';

export const metadata: Metadata = { title: 'ログイン / 新規登録' };

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">SHARE Quest</h1>
      <Suspense fallback={null}>
        <TabSwitcher initialTab={tab === 'signup' ? 'signup' : 'login'} />
      </Suspense>
    </div>
  );
}
