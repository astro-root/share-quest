import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article/ArticleCard';
import type { ArticleWithDetails } from '@/lib/types';

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toArticle = (row: any): ArticleWithDetails => ({
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    cover_image_url: row.cover_image_url,
    author_id: row.author_id,
    status: row.status,
    published_at: row.published_at,
    view_count: row.view_count,
    is_featured: row.is_featured ?? false,
    created_at: row.created_at,
    updated_at: row.updated_at,
    profiles: row.profiles,
    tags: (row.article_tags ?? []).map((at: { tags: ArticleWithDetails['tags'][number] }) => at.tags).filter(Boolean),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const favorites = (favRes.data ?? []).map((r: any) => r.articles).filter(Boolean).map(toArticle);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const liked = (likeRes.data ?? []).map((r: any) => r.articles).filter(Boolean).map(toArticle);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">マイページ</h1>
        <Link href="/profile/edit" className="text-sm text-indigo-600 hover:underline">プロフィール編集</Link>
      </div>
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          保存した記事 <span className="text-gray-400 font-normal">({favorites.length})</span>
        </h2>
        {favorites.length === 0 ? (
          <p className="text-gray-400 text-sm py-6 text-center">まだ保存した記事がありません</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((a: ArticleWithDetails) => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          いいねした記事 <span className="text-gray-400 font-normal">({liked.length})</span>
        </h2>
        {liked.length === 0 ? (
          <p className="text-gray-400 text-sm py-6 text-center">まだいいねした記事がありません</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liked.map((a: ArticleWithDetails) => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
