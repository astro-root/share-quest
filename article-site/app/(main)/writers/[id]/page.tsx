import { notFound } from 'next/navigation';
import Image from 'next/image';
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
  return { title: (data.display_name ?? data.username) + ' の記事一覧' };
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={displayName} width={80} height={80} className="object-cover w-full h-full" />
            ) : (
              <span className="text-3xl font-bold text-gray-400">{displayName[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-sm text-gray-400 mb-2">@{profile.username}</p>
            {profile.bio && <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">記事一覧</h2>
        <span className="text-sm text-gray-400">{articles.length} 件</span>
      </div>
      {articles.length === 0 ? (
        <p className="text-center text-gray-400 py-12">まだ記事がありません</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}
