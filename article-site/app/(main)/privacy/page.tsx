import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'プライバシーポリシー | SHARE Quest' };

const sections = [
  {
    title: '1. はじめに',
    body: 'SHARE Quest（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、当サイトが収集する情報とその利用方法について説明します。',
  },
  {
    title: '2. 収集する情報',
    body: 'アカウント登録時に提供されるメールアドレス・表示名、プロフィール画像・自己紹介文（任意）、記事の閲覧履歴・いいね・お気に入りの利用状況、お問い合わせフォームで入力された情報を収集することがあります。',
  },
  {
    title: '3. 情報の利用目的',
    body: '収集した情報は、サービスの提供・運営・改善、お問い合わせへの対応、および利用規約違反への対応のために利用します。',
  },
  {
    title: '4. 第三者への提供',
    body: '当サイトは、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供しません。なお、当サイトはSupabase（認証・データベース）およびVercel（ホスティング）を利用しており、これらのサービスのプライバシーポリシーも適用されます。',
  },
  {
    title: '5. Cookieの使用',
    body: '当サイトは、認証状態の維持のためにCookieを使用します。ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。',
  },
  {
    title: '6. お問い合わせ',
    body: null,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-[70vh] px-4 py-16">
      <div className="max-w-2xl mx-auto">

        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0f1f3d] dark:bg-blue-900/40 mb-4">
            <svg className="w-6 h-6 text-white dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">プライバシーポリシー</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">最終更新日：2026年1月1日</p>
        </div>

        <div className="flex flex-col gap-4">
          {sections.map((s) => (
            <section
              key={s.title}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6"
            >
              <h2 className="text-sm font-bold text-[#0f1f3d] dark:text-blue-300 mb-3">{s.title}</h2>
              {s.body ? (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.body}</p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  本ポリシーに関するお問い合わせは、
                  <a href="/contact" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-75 transition">
                    お問い合わせフォーム
                  </a>
                  よりご連絡ください。
                </p>
              )}
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}
