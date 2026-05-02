import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { UserRoleForm } from '@/components/admin/UserRoleForm';
import { ApproveButton } from '@/components/admin/ApproveButton';
import { FeaturedToggle } from '@/components/admin/FeaturedToggle';
import { DeleteArticleButton } from '@/components/article/DeleteArticleButton';

export const metadata: Metadata = { title: '管理画面' };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/writer/login');

  const { data: me } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') redirect('/articles');

  const [{ data: profiles }, { data: pendingArticles }, { data: publishedArticles }] = await Promise.all([
    supabase.from('profiles').select('id, username, display_name, avatar_url, role').order('created_at', { ascending: true }),
    supabase.from('articles').select('id, title, created_at, profiles!author_id ( display_name, username )').eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('articles').select('id, title, is_featured, profiles!author_id ( display_name, username )').eq('status', 'published').order('published_at', { ascending: false }),
  ]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-8">
      <h1 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200">管理画面</h1>

      {/* 承認待ち */}
      <section>
        <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">
          承認待ち記事
          {pendingArticles && pendingArticles.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
              {pendingArticles.length}
            </span>
          )}
        </h2>
        {!pendingArticles || pendingArticles.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center bg-white rounded-xl border border-gray-100">承認待ちの記事はありません</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            {pendingArticles.map((article) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const a = article as any;
              const authorName = a.profiles?.display_name ?? a.profiles?.username ?? '不明';
              return (
                <div key={article.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-1">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{authorName}</p>
                  </div>
                  <ApproveButton articleId={article.id} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* おすすめ設定 */}
      <section>
        <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">おすすめ記事の設定</h2>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {!publishedArticles || publishedArticles.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">公開済みの記事がありません</p>
          ) : publishedArticles.map((article) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const a = article as any;
            const authorName = a.profiles?.display_name ?? a.profiles?.username ?? '不明';
            return (
              <div key={article.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <Link href={'/articles/' + article.id}
                    className="font-medium text-gray-800 hover:text-blue-700 transition-colors line-clamp-1 text-sm">
                    {article.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{authorName}</p>
                </div>
                <FeaturedToggle articleId={article.id} initialIsFeatured={article.is_featured} />
                <Link href={'/articles/' + article.id + '/edit'} className="text-xs text-blue-600 hover:underline whitespace-nowrap">編集</Link>
                <DeleteArticleButton articleId={article.id} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ユーザー管理 */}
      <section>
        <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">ユーザー管理</h2>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {(profiles ?? []).map((p) => {
            const displayName = p.display_name ?? p.username;
            const roleBadgeColor = p.role === 'admin'
              ? 'bg-purple-100 text-purple-700'
              : p.role === 'writer'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-500';
            const roleLabel = p.role === 'admin' ? '編集長' : p.role === 'writer' ? 'ライター' : '閲覧者';
            return (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {p.avatar_url ? (
                    <Image src={p.avatar_url} alt={displayName} width={36} height={36} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-500 text-sm font-bold">{displayName[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{displayName}</p>
                  <p className="text-xs text-gray-400">@{p.username}</p>
                </div>
                <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeColor}`}>
                  {roleLabel}
                </span>
                {p.id !== user.id ? (
                  <UserRoleForm userId={p.id} currentRole={p.role} />
                ) : (
                  <span className="text-xs text-gray-400 italic">（自分）</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
