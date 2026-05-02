import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'プライバシーポリシー' };

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">プライバシーポリシー</h1>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">最終更新日：2026年1月1日</p>

      <div className="flex flex-col gap-8 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">1. はじめに</h2>
          <p>SHARE Quest（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、当サイトが収集する情報とその利用方法について説明します。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">2. 収集する情報</h2>
          <p>当サイトでは、以下の情報を収集することがあります。</p>
          <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
            <li>アカウント登録時に提供されるメールアドレス・表示名</li>
            <li>プロフィール画像・自己紹介文（任意）</li>
            <li>記事の閲覧履歴・いいね・お気に入りの利用状況</li>
            <li>お問い合わせフォームで入力された情報</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">3. 情報の利用目的</h2>
          <p>収集した情報は以下の目的で利用します。</p>
          <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
            <li>サービスの提供・運営・改善</li>
            <li>お問い合わせへの対応</li>
            <li>利用規約違反への対応</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">4. 第三者への提供</h2>
          <p>当サイトは、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供しません。なお、当サイトはSupabase（認証・データベース）およびVercel（ホスティング）を利用しており、これらのサービスのプライバシーポリシーも適用されます。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">5. Cookieの使用</h2>
          <p>当サイトは、認証状態の維持のためにCookieを使用します。ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">6. お問い合わせ</h2>
          <p>本ポリシーに関するお問い合わせは、<a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">お問い合わせフォーム</a>よりご連絡ください。</p>
        </section>
      </div>
    </div>
  );
}
