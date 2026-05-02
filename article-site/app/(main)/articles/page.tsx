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
  const popular = [...articles].sort((a, b) => b.view_count - a.view_count).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-8">
      {/* メインコンテンツ */}
      <div className="flex-1 min-w-0">
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
            {!isFiltering && featured.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-4">おすすめ記事</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featured.map((a) => <ArticleCard key={a.id} article={a} featured />)}
                </div>
              </section>
            )}
            <section>
              <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-2">
                {isFiltering ? '検索結果' : '新着記事'}
              </h2>
              <div>
                {(isFiltering ? articles : regular).map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            </section>
          </>
        )}
      </div>

      {/* サイドバー */}
      <aside className="w-60 flex-shrink-0 hidden lg:block">
        <div className="sticky top-20">
          <h3 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">ランキング</h3>
          <ol className="space-y-3">
            {popular.map((a, i) => (
              <li key={a.id} className="flex gap-2 items-start">
                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-blue-200 text-blue-800'}`}>
                  {i + 1}
                </span>
                <a href={'/articles/' + a.id} className="text-xs text-gray-700 hover:text-blue-700 transition-colors line-clamp-3 leading-snug font-medium">
                  {a.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}
