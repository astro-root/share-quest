import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article/ArticleCard';
import type { ArticleWithDetails } from '@/lib/types';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('display_name, username').eq('id', id).single();
  if (!data) return { title: 'ライターが見つかりません' };
  return { title: (data.display_name ?? data.username) + ' | SHARE Quest' };
}

export default async function WriterProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio, role')
    .eq('id', id)
    .in('role', ['writer', 'admin'])
    .single();

  if (!profile) notFound();

  const { data } = await supabase
    .from('articles')
    .select(`
      id, title, content, excerpt, cover_image_url, author_id, status,
      published_at, view_count, is_featured, created_at, updated_at,
      profiles!author_id ( id, username, display_name, avatar_url ),
      article_tags ( tags ( id, name, slug ) )
    `)
    .eq('author_id', id)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const articles: ArticleWithDetails[] = (data ?? []).map((row: any) => ({
    id: row.id, title: row.title, content: row.content, excerpt: row.excerpt,
    cover_image_url: row.cover_image_url, author_id: row.author_id,
    status: row.status as 'draft' | 'published', published_at: row.published_at,
    view_count: row.view_count, is_featured: row.is_featured ?? false,
    created_at: row.created_at, updated_at: row.updated_at,
    profiles: row.profiles,
    tags: (row.article_tags ?? []).map((at: { tags: ArticleWithDetails['tags'][number] }) => at.tags).filter(Boolean),
  }));

  const displayName = profile.display_name ?? profile.username;
  const roleLabel = profile.role === 'admin' ? '編集長' : 'ライター';

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* 戻るリンク */}
      <div className="mb-4">
        <Link href="/writers" className="text-xs text-gray-400 hover:text-blue-700 transition-colors">&lt; ライター一覧</Link>
      </div>

      {/* プロフィールカード */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-start gap-4">
          {/* アイコン */}
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={displayName} width={64} height={64} className="object-cover w-full h-full" />
            ) : (
              <span className="text-2xl font-bold text-gray-400">{displayName[0].toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-base font-bold text-gray-900">{displayName}</h1>
              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">{roleLabel}</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">@{profile.username}</p>
            {profile.bio && <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>}
          </div>
        </div>
      </div>

      {/* 記事一覧 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1">この人の記事</h2>
        <span className="text-xs text-gray-400">{articles.length}件</span>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-gray-400 py-12">まだ記事がありません</p>
      ) : (
        <div>
          {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}
