import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArticleEditForm } from '@/components/article/ArticleEditForm';

export const metadata: Metadata = { title: '記事を編集' };

type Props = { params: Promise<{ id: string }> };

export default async function ArticleEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/writer/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['writer', 'admin'].includes(profile.role)) redirect('/articles');

  const { data: article } = await supabase
    .from('articles')
    .select('id, title, content, excerpt, cover_image_url, author_id, status, article_tags ( tag_id )')
    .eq('id', id)
    .single();

  if (!article) notFound();
  if (profile.role !== 'admin' && article.author_id !== user.id) redirect('/articles');

  const { data: tagsData } = await supabase.from('tags').select('id, name, slug').order('name');
  const tags = tagsData ?? [];
  const defaultTagIds = (article.article_tags as { tag_id: string }[]).map((t) => t.tag_id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">記事を編集</h1>
        <ArticleEditForm
          articleId={article.id}
          defaultTitle={article.title}
          defaultContent={article.content}
          defaultExcerpt={article.excerpt}
          defaultTagIds={defaultTagIds}
          defaultCoverImageUrl={article.cover_image_url}
          tags={tags}
        />
      </div>
    </div>
  );
}
