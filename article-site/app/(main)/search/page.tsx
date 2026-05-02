import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article/ArticleCard';
import { SearchPage } from '@/components/article/SearchPage';
import type { ArticleWithDetails } from '@/lib/types';

export const metadata: Metadata = { title: '検索 | SHARE Quest' };

type Props = { searchParams: Promise<{ q?: string; tag?: string; writer?: string }> };

function toArticle(row: Record<string, unknown>): ArticleWithDetails {
  return {
    id: row.id as string, title: row.title as string, content: row.content as string,
    excerpt: row.excerpt as string | null, cover_image_url: row.cover_image_url as string | null,
    author_id: row.author_id as string, status: row.status as 'draft' | 'published',
    published_at: row.published_at as string | null, view_count: row.view_count as number,
    is_featured: row.is_featured as boolean, created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    profiles: row.profiles as ArticleWithDetails['profiles'],
    tags: ((row.article_tags as { tags: ArticleWithDetails['tags'][number] }[]) ?? [])
      .map((at) => at.tags).filter(Boolean),
  };
}

export default async function SearchPageRoute({ searchParams }: Props) {
  const { q = '', tag = '', writer = '' } = await searchParams;
  const supabase = await createClient();

  const [tagsRes, writersRes] = await Promise.all([
    supabase.from('tags').select('id, name, slug').order('name'),
    supabase.from('profiles').select('id, username, display_name, avatar_url').in('role', ['writer', 'admin']).order('display_name'),
  ]);

  const tags = tagsRes.data ?? [];
  const writers = writersRes.data ?? [];

  let query = supabase
    .from('articles')
    .select(`
      id, title, content, excerpt, cover_image_url, author_id, status,
      published_at, view_count, is_featured, created_at, updated_at,
      profiles!author_id ( id, username, display_name, avatar_url ),
      article_tags ( tags ( id, name, slug ) )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
  if (writer) query = query.eq('author_id', writer);

  const { data } = await query;
  let articles = ((data ?? []) as unknown as Record<string, unknown>[]).map(toArticle);
  if (tag) articles = articles.filter((a) => a.tags.some((t) => t.slug === tag));

  const isFiltering = q !== '' || tag !== '' || writer !== '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <Suspense fallback={null}>
        <SearchPage
          tags={tags}
          writers={writers}
          currentQ={q}
          currentTag={tag}
          currentWriter={writer}
          articles={articles}
          isFiltering={isFiltering}
        />
      </Suspense>
    </div>
  );
}
