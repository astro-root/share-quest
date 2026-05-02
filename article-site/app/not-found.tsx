import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: '404 - ページが見つかりません' };

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black text-[#0f1f3d] dark:text-white mb-4">404</p>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">ページが見つかりません</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">お探しのページは移動・削除されたか、URLが間違っている可能性があります。</p>
        <div className="flex items-center justify-center gap-3">
          <a href="/" className="px-6 py-2.5 rounded-full bg-[#0f1f3d] hover:bg-[#1a3460] text-white text-sm font-semibold transition-colors">トップへ戻る</a>
          <a href="/articles" className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:border-blue-300 hover:text-blue-700 transition-colors">記事一覧</a>
        </div>
      </div>
    </div>
  );
}
