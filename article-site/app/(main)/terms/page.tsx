import type { Metadata } from 'next';
export const metadata: Metadata = { title: '利用規約' };

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">利用規約</h1>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">最終更新日：2026年1月1日</p>

      <div className="flex flex-col gap-8 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">1. はじめに</h2>
          <p>本規約は、SHARE Quest（以下「当サイト」）の利用条件を定めるものです。ユーザーは本規約に同意のうえ、当サイトをご利用ください。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">2. 禁止事項</h2>
          <p>ユーザーは以下の行為を行ってはなりません。</p>
          <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
            <li>他のユーザーや第三者への誹謗中傷・嫌がらせ</li>
            <li>虚偽の情報の登録・投稿</li>
            <li>著作権・肖像権その他の権利を侵害する行為</li>
            <li>当サイトのシステムへの不正アクセス・妨害行為</li>
            <li>法令または公序良俗に反する行為</li>
            <li>その他、当サイトが不適切と判断する行為</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">3. コンテンツの権利</h2>
          <p>ライターが投稿した記事の著作権は各ライターに帰属します。ただし、当サイトはサービス運営・宣伝の目的でコンテンツを利用する権利を有します。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">4. アカウントの管理</h2>
          <p>ユーザーは自己の責任においてアカウントを管理してください。アカウントの不正利用によって生じた損害について、当サイトは責任を負いません。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">5. サービスの変更・停止</h2>
          <p>当サイトは、予告なくサービスの内容を変更・停止する場合があります。これによってユーザーに損害が生じた場合であっても、当サイトは責任を負いません。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">6. 免責事項</h2>
          <p>当サイトは、掲載コンテンツの正確性・完全性を保証しません。当サイトの利用によって生じた損害について、当サイトは一切の責任を負いません。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">7. 規約の変更</h2>
          <p>当サイトは、必要に応じて本規約を変更することがあります。変更後の規約はサイト上に掲載した時点で効力を生じます。</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">8. お問い合わせ</h2>
          <p>本規約に関するお問い合わせは、<a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">お問い合わせフォーム</a>よりご連絡ください。</p>
        </section>
      </div>
    </div>
  );
}
