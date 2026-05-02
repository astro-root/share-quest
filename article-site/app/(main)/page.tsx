import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article/ArticleCard';
import { SearchAndFilter } from '@/components/article/SearchAndFilter';
import type { ArticleWithDetails } from '@/lib/types';

export const metadata: Metadata = { title: 'SHARE Quest | 学びの「楽しい！」をつなげる' };
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
  const popular = [...articles].sort((a, b) => b.view_count - a.view_count).slice(0, 5);
  const regular = articles.filter((a) => !a.is_featured);
  const isFiltering = q !== '' || tag !== '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 lg:max-w-6xl">
      {/* ヘッダーナビ */}
      <div className="flex items-center justify-between mb-4 text-xs text-gray-500 border-b border-gray-200 pb-2">
        <div className="flex gap-4">
          <Link href="/articles" className="text-blue-800 font-semibold border-b-2 border-blue-800 pb-1">記事</Link>
          <Link href="/writers" className="hover:text-blue-700 transition-colors">ライター</Link>
        </div>
      </div>

      {/* 検索・タグフィルター */}
      <Suspense fallback={null}>
        <SearchAndFilter tags={tags} currentQ={q} currentTag={tag} />
      </Suspense>

      {error ? (
        <p className="text-center text-red-500 py-16">記事の取得に失敗しました</p>
      ) : isFiltering ? (
        <section>
          <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">検索結果 <span className="text-gray-400 font-normal">{articles.length}件</span></h2>
          {articles.length === 0 ? (
            <p className="text-center text-gray-400 py-16">条件に一致する記事がありません</p>
          ) : (
            <div className="lg:flex lg:gap-8">
              <div className="flex-1 min-w-0">
                {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="lg:flex lg:gap-8">
          {/* メイン */}
          <div className="flex-1 min-w-0 space-y-8">
            {featured.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1">おすすめ記事</h2>
                  <Link href="/articles?featured=1" className="text-xs text-gray-400 hover:text-blue-700 transition-colors">もっと見る &gt;</Link>
                </div>
                <div className="space-y-0">
                  {featured.map((a) => <ArticleCard key={a.id} article={a} />)}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1">新着記事</h2>
                <span className="text-xs text-gray-400">{regular.length}件</span>
              </div>
              <div>
                {regular.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">まだ記事がありません</p>
                ) : (
                  regular.map((a) => <ArticleCard key={a.id} article={a} />)
                )}
              </div>
            </section>
          </div>

          {/* サイドバー（PC only） */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">人気の記事</h3>
                <ol className="space-y-3">
                  {popular.map((a, i) => (
                    <li key={a.id} className="flex gap-2 items-start">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${
                        i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-blue-200 text-blue-800'
                      }`}>
                        {i + 1}
                      </span>
                      <Link href={'/articles/' + a.id} className="text-xs text-gray-700 hover:text-blue-700 transition-colors line-clamp-3 leading-snug font-medium">
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
