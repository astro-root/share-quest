import type { Metadata } from 'next';
export const metadata: Metadata = { title: '利用規約 | SHARE Quest' };

const sections = [
  {
    title: '1. はじめに',
    body: '本規約は、SHARE Quest（以下「当サイト」）の利用条件を定めるものです。ユーザーは本規約に同意のうえ、当サイトをご利用ください。',
  },
  {
    title: '2. 禁止事項',
    body: '他のユーザーや第三者への誹謗中傷・嫌がらせ、虚偽の情報の登録・投稿、著作権・肖像権その他の権利を侵害する行為、当サイトのシステムへの不正アクセス・妨害行為、法令または公序良俗に反する行為、その他当サイトが不適切と判断する行為を禁止します。',
  },
  {
    title: '3. コンテンツの権利',
    body: 'ライターが投稿した記事の著作権は各ライターに帰属します。ただし、当サイトはサービス運営・宣伝の目的でコンテンツを利用する権利を有します。',
  },
  {
    title: '4. アカウントの管理',
    body: 'ユーザーは自己の責任においてアカウントを管理してください。アカウントの不正利用によって生じた損害について、当サイトは責任を負いません。',
  },
  {
    title: '5. サービスの変更・停止',
    body: '当サイトは、予告なくサービスの内容を変更・停止する場合があります。これによってユーザーに損害が生じた場合であっても、当サイトは責任を負いません。',
  },
  {
    title: '6. 免責事項',
    body: '当サイトは、掲載コンテンツの正確性・完全性を保証しません。当サイトの利用によって生じた損害について、当サイトは一切の責任を負いません。',
  },
  {
    title: '7. 規約の変更',
    body: '当サイトは、必要に応じて本規約を変更することがあります。変更後の規約はサイト上に掲載した時点で効力を生じます。',
  },
  {
    title: '8. お問い合わせ',
    body: null,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-[70vh] px-4 py-16">
      <div className="max-w-2xl mx-auto">

        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0f1f3d] dark:bg-blue-900/40 mb-4">
            <svg className="w-6 h-6 text-white dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">利用規約</h1>
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
                  本規約に関するお問い合わせは、
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
