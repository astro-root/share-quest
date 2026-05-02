import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article/ArticleCard';
import type { ArticleWithDetails } from '@/lib/types';

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role, display_name, username, avatar_url').eq('id', user.id).single();
  if (profile?.role === 'writer' || profile?.role === 'admin') redirect('/profile/edit');

  const selectFields = `
    id, title, content, excerpt, cover_image_url, author_id, status,
    published_at, view_count, is_featured, created_at, updated_at,
    profiles!author_id ( id, username, display_name, avatar_url ),
    article_tags ( tags ( id, name, slug ) )
  `;

  const [favRes, likeRes] = await Promise.all([
    supabase.from('favorites').select(`article_id, articles ( ${selectFields} )`).eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('likes').select(`article_id, articles ( ${selectFields} )`).eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const toArticle = (row: any): ArticleWithDetails => ({
    id: row.id, title: row.title, content: row.content, excerpt: row.excerpt,
    cover_image_url: row.cover_image_url, author_id: row.author_id,
    status: row.status, published_at: row.published_at,
    view_count: row.view_count, is_featured: row.is_featured ?? false,
    created_at: row.created_at, updated_at: row.updated_at,
    profiles: row.profiles,
    tags: (row.article_tags ?? []).map((at: { tags: ArticleWithDetails['tags'][number] }) => at.tags).filter(Boolean),
  });

  const favorites = (favRes.data ?? []).map((r: any) => r.articles).filter(Boolean).map(toArticle);
  const liked = (likeRes.data ?? []).map((r: any) => r.articles).filter(Boolean).map(toArticle);
  const displayName = profile?.display_name ?? profile?.username ?? '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h1 className="text-base font-bold text-gray-900">お気に入り</h1>
        <Link href="/profile/edit" className="text-xs text-gray-400 hover:text-blue-700 transition-colors">プロフィール編集</Link>
      </div>

      {/* 未ログイン誘導 */}
      {favorites.length === 0 && liked.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm mb-1">まだお気に入りに登録した記事がありません</p>
          <p className="text-xs">好きな記事をお気に入り登録しよう</p>
        </div>
      )}

      {/* 保存した記事 */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">
          保存した記事 <span className="text-gray-400 font-normal text-xs">({favorites.length})</span>
        </h2>
        {favorites.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">まだ保存した記事がありません</p>
        ) : (
          <div>{favorites.map((a: ArticleWithDetails) => <ArticleCard key={a.id} article={a} />)}</div>
        )}
      </section>

      {/* いいねした記事 */}
      <section>
        <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">
          いいねした記事 <span className="text-gray-400 font-normal text-xs">({liked.length})</span>
        </h2>
        {liked.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">まだいいねした記事がありません</p>
        ) : (
          <div>{liked.map((a: ArticleWithDetails) => <ArticleCard key={a.id} article={a} />)}</div>
        )}
      </section>
    </div>
  );
}
