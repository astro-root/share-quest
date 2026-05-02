'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateUserRole(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未ログインです' };

  const { data: me } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') return { error: '権限がありません' };

  const targetId = formData.get('user_id') as string;
  const newRole = formData.get('role') as string;

  if (!['reader', 'writer', 'admin'].includes(newRole)) {
    return { error: '無効なロールです' };
  }
  if (targetId === user.id) return { error: '自分自身のロールは変更できません' };

  const { error } = await supabase
    .from('profiles').update({ role: newRole }).eq('id', targetId);
  if (error) return { error: '更新に失敗しました' };

  revalidatePath('/admin');
  return { success: true };
}

export async function toggleFeatured(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean; isFeatured?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未ログインです' };

  const { data: me } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') return { error: '権限がありません' };

  const articleId = formData.get('article_id') as string;
  const { data: article } = await supabase
    .from('articles').select('is_featured').eq('id', articleId).single();
  if (!article) return { error: '記事が見つかりません' };

  const next = !article.is_featured;
  const { error } = await supabase
    .from('articles').update({ is_featured: next }).eq('id', articleId);
  if (error) return { error: '更新に失敗しました' };

  revalidatePath('/articles');
  revalidatePath('/admin');
  return { success: true, isFeatured: next };
}
