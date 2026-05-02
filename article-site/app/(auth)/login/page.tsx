import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TabSwitcher } from '@/components/auth/TabSwitcher';
export const metadata: Metadata = { title: 'ログイン / 新規登録' };
type Props = { searchParams: Promise<{ tab?: string }> };
export default async function LoginPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold text-blue-800">SHARE Quest</h1>
        <p className="text-xs text-gray-400 mt-1">学びの「楽しい！」をつなげる</p>
      </div>
      <Suspense fallback={null}>
        <TabSwitcher initialTab={tab === 'signup' ? 'signup' : 'login'} />
      </Suspense>
    </div>
  );
}
