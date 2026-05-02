import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArticleForm } from '@/components/article/ArticleForm';
import type { Tag } from '@/lib/types';

export const metadata: Metadata = {
  title: '記事を投稿',
};

export default async function NewArticlePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/articles/new');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['writer', 'admin'].includes(profile.role)) {
    redirect('/articles');
  }

  const { data: tags } = await supabase
    .from('tags')
    .select('id, name, slug, created_at')
    .order('name');

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">記事を投稿</h1>
      <ArticleForm tags={(tags ?? []) as Tag[]} />
    </div>
  );
}