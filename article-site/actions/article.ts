'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const ArticleSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, '200文字以内で入力してください'),
  content: z.string().min(1, '本文は必須です'),
  excerpt: z.string().max(500, '500文字以内で入力してください').optional().transform((v) => (v === '' ? undefined : v)),
  status: z.enum(['draft', 'pending']),
  tagIds: z.array(z.string().uuid()).default([]),
});

export type ArticleFormState = {
  errors?: {
    title?: string[];
    content?: string[];
    excerpt?: string[];
    status?: string[];
    tagIds?: string[];
    coverImage?: string[];
    _general?: string[];
  };
  success?: boolean;
};

export async function createArticle(prevState: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { errors: { _general: ['ログインが必要です'] } };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['writer', 'admin'].includes(profile.role)) return { errors: { _general: ['投稿権限がありません'] } };

  const rawTagIds = formData.getAll('tagIds') as string[];
  const parsed = ArticleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    status: formData.get('status'),
    tagIds: rawTagIds,
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { title, content, excerpt, status, tagIds } = parsed.data;
  let coverImageUrl: string | null = null;
  const coverImageFile = formData.get('coverImage') as File | null;

  if (coverImageFile && coverImageFile.size > 0) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(coverImageFile.type)) return { errors: { coverImage: ['JPEG/PNG/WebP 形式のみ対応しています'] } };
    if (coverImageFile.size > 5 * 1024 * 1024) return { errors: { coverImage: ['画像は5MB以下にしてください'] } };

    const fileExt = coverImageFile.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('article-images').upload(filePath, coverImageFile);
    if (uploadError) return { errors: { _general: ['画像のアップロードに失敗しました'] } };
    const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(filePath);
    coverImageUrl = publicUrl;
  }

  const { data: article, error: articleError } = await supabase
    .from('articles')
    .insert({ title, content, excerpt: excerpt ?? null, cover_image_url: coverImageUrl, author_id: user.id, status, published_at: null })
    .select('id')
    .single();

  if (articleError || !article) return { errors: { _general: ['記事の作成に失敗しました'] } };

  if (tagIds.length > 0) {
    const { error: tagError } = await supabase.from('article_tags').insert(tagIds.map((tagId) => ({ article_id: article.id, tag_id: tagId })));
    if (tagError) console.error('article_tags insert failed:', tagError);
  }

  revalidatePath('/articles');
  redirect(`/articles/${article.id}`);
}

export type ApproveArticleState = { error?: string; success?: boolean };

export async function approveArticle(_prevState: ApproveArticleState, formData: FormData): Promise<ApproveArticleState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'ログインが必要です' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: '権限がありません' };

  const articleId = formData.get('articleId') as string;
  const action = formData.get('action') as string;
  const newStatus = action === 'approve' ? 'published' : 'draft';

  const { error } = await supabase.from('articles').update({
    status: newStatus,
    published_at: action === 'approve' ? new Date().toISOString() : null,
  }).eq('id', articleId);

  if (error) return { error: '更新に失敗しました' };
  revalidatePath('/articles');
  revalidatePath('/admin');
  return { success: true };
}

export async function incrementViewCount(articleId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc('increment_view_count', { article_id: articleId });
}

export async function updateProfile(_: unknown, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未ログインです' };

  const display_name = formData.get('display_name') as string;
  const username = formData.get('username') as string;
  const bio = formData.get('bio') as string;
  const avatar_url = formData.get('avatar_url') as string;

  const { error } = await supabase.from('profiles')
    .update({ display_name: display_name || null, username, bio: bio || null, avatar_url: avatar_url || null })
    .eq('id', user.id);

  if (error) return { error: '更新に失敗しました' };
  revalidatePath('/');
  return { success: true };
}

export async function toggleFavorite(_: unknown, formData: FormData): Promise<{ error?: string; isFavorited?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未ログインです' };

  const articleId = formData.get('article_id') as string;
  const { data: existing } = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('article_id', articleId).single();

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    revalidatePath(`/articles/${articleId}`);
    return { isFavorited: false };
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, article_id: articleId });
    revalidatePath(`/articles/${articleId}`);
    return { isFavorited: true };
  }
}

export async function toggleLike(_: unknown, formData: FormData): Promise<{ error?: string; isLiked?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未ログインです' };

  const articleId = formData.get('article_id') as string;
  const { data: existing } = await supabase.from('likes').select('id').eq('user_id', user.id).eq('article_id', articleId).single();

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id);
    revalidatePath(`/articles/${articleId}`);
    return { isLiked: false };
  } else {
    await supabase.from('likes').insert({ user_id: user.id, article_id: articleId });
    revalidatePath(`/articles/${articleId}`);
    return { isLiked: true };
  }
}

export async function addComment(_: unknown, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'ログインが必要です' };

  const articleId = formData.get('article_id') as string;
  const content = (formData.get('content') as string)?.trim();

  if (!content || content.length === 0) return { error: 'コメントを入力してください' };
  if (content.length > 500) return { error: '500文字以内で入力してください' };

  const { error } = await supabase.from('comments').insert({ article_id: articleId, user_id: user.id, content });
  if (error) return { error: 'コメントの投稿に失敗しました' };

  revalidatePath(`/articles/${articleId}`);
  return { success: true };
}

export async function deleteComment(_: unknown, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未ログインです' };

  const commentId = formData.get('comment_id') as string;
  const articleId = formData.get('article_id') as string;

  const { data: comment } = await supabase.from('comments').select('user_id').eq('id', commentId).single();
  if (!comment) return { error: 'コメントが見つかりません' };
  if (comment.user_id !== user.id) return { error: '削除権限がありません' };

  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) return { error: '削除に失敗しました' };

  revalidatePath(`/articles/${articleId}`);
  return { success: true };
}

export async function deleteArticle(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未ログインです' };

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile) return { error: '権限がありません' };

  const articleId = formData.get('article_id') as string;

  // adminは全記事削除可、writerは自分の記事のみ
  const { data: article } = await supabase
    .from('articles').select('author_id, status').eq('id', articleId).single();
  if (!article) return { error: '記事が見つかりません' };

  if (profile.role !== 'admin' && article.author_id !== user.id) {
    return { error: '削除権限がありません' };
  }

  const { error } = await supabase.from('articles').delete().eq('id', articleId);
  if (error) return { error: '削除に失敗しました' };

  revalidatePath('/articles');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateArticle(prevState: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { errors: { _general: ['ログインが必要です'] } };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['writer', 'admin'].includes(profile.role)) return { errors: { _general: ['編集権限がありません'] } };

  const articleId = formData.get('article_id') as string;
  const { data: existing } = await supabase.from('articles').select('author_id, status').eq('id', articleId).single();
  if (!existing) return { errors: { _general: ['記事が見つかりません'] } };
  if (profile.role !== 'admin' && existing.author_id !== user.id) return { errors: { _general: ['編集権限がありません'] } };

  const rawTagIds = formData.getAll('tagIds') as string[];
  const parsed = ArticleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    status: formData.get('status'),
    tagIds: rawTagIds,
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { title, content, excerpt, status, tagIds } = parsed.data;

  let coverImageUrl: string | null = null;
  const coverImageFile = formData.get('coverImage') as File | null;
  if (coverImageFile && coverImageFile.size > 0) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(coverImageFile.type)) return { errors: { coverImage: ['JPEG/PNG/WebP 形式のみ対応しています'] } };
    if (coverImageFile.size > 5 * 1024 * 1024) return { errors: { coverImage: ['画像は5MB以下にしてください'] } };
    const fileExt = coverImageFile.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('article-images').upload(filePath, coverImageFile);
    if (uploadError) return { errors: { _general: ['画像のアップロードに失敗しました'] } };
    const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(filePath);
    coverImageUrl = publicUrl;
  }

  const updateData: Record<string, unknown> = {
    title, content, excerpt: excerpt ?? null, status,
    published_at: status === 'pending' && existing.status !== 'published' ? null : undefined,
  };
  if (coverImageUrl) updateData.cover_image_url = coverImageUrl;

  const { error: updateError } = await supabase.from('articles').update(updateData).eq('id', articleId);
  if (updateError) return { errors: { _general: ['更新に失敗しました'] } };

  await supabase.from('article_tags').delete().eq('article_id', articleId);
  if (tagIds.length > 0) {
    await supabase.from('article_tags').insert(tagIds.map((tagId) => ({ article_id: articleId, tag_id: tagId })));
  }

  revalidatePath('/articles');
  revalidatePath(`/articles/${articleId}`);
  redirect(`/articles/${articleId}`);
}
