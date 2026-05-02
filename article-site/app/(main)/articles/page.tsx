import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article/ArticleCard';
import { SearchAndFilter } from '@/components/article/SearchAndFilter';
import type { ArticleWithDetails } from '@/lib/types';

export const metadata: Metadata = { title: '記事一覧 | SHARE Quest' };
export const revalidate = 60;

type Props = { searchParams: Promise<{ q?: string; tag?: string }> };

function toArticle(row: Record<string, unknown>): ArticleWithDetails {
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    excerpt: row.excerpt as string | null,
    cover_image_url: row.cover_image_url as string | null,
    author_id: row.author_id as string,
    status: row.status as 'draft' | 'published',
    published_at: row.published_at as string | null,
    view_count: row.view_count as number,
    is_featured: row.is_featured as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    profiles: row.profiles as ArticleWithDetails['profiles'],
    tags: ((row.article_tags as { tags: ArticleWithDetails['tags'][number] }[]) ?? [])
      .map((at) => at.tags).filter(Boolean),
  };
}

const SELECT = `
  id, title, content, excerpt, cover_image_url, author_id, status,
  published_at, view_count, is_featured, created_at, updated_at,
  profiles!author_id ( id, username, display_name, avatar_url ),
  article_tags ( tags ( id, name, slug ) )
`;

export default async function ArticlesPage({ searchParams }: Props) {
  const { q = '', tag = '' } = await searchParams;
  const supabase = await createClient();

  const { data: tagsData } = await supabase.from('tags').select('id, name, slug').order('name');
  const tags = tagsData ?? [];

  let query = supabase
    .from('articles')
    .select(SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);

  const { data, error } = await query;
  let articles = ((data ?? []) as unknown as Record<string, unknown>[]).map(toArticle);

  if (tag) articles = articles.filter((a) => a.tags.some((t) => t.slug === tag));

  const featured = articles.filter((a) => a.is_featured);
  const regular = articles.filter((a) => !a.is_featured);
  const isFiltering = q !== '' || tag !== '';

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">記事一覧</h1>
        <p className="text-gray-400 text-sm mt-1">学びの「楽しい！」をつなげる</p>
      </div>

      {/* 検索・タグフィルター */}
      <Suspense fallback={null}>
        <SearchAndFilter tags={tags} currentQ={q} currentTag={tag} />
      </Suspense>

      {error ? (
        <p className="text-center text-red-500 py-16">記事の取得に失敗しました</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-400 py-16">
          {isFiltering ? '条件に一致する記事がありません' : 'まだ記事がありません'}
        </p>
      ) : (
        <>
          {/* おすすめセクション（フィルター中は非表示） */}
          {!isFiltering && featured.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400 text-lg">★</span>
                <h2 className="text-lg font-bold text-gray-800">おすすめ記事</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {featured.map((a) => <ArticleCard key={a.id} article={a} featured />)}
              </div>
            </section>
          )}

          {/* 新着セクション */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {isFiltering ? '検索結果' : '新着記事'}
              </h2>
              <span className="text-sm text-gray-400">{(isFiltering ? articles : regular).length} 件</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(isFiltering ? articles : regular).map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
