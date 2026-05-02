import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArticleContent } from '@/components/article/ArticleContent';
import { TagBadge } from '@/components/article/TagBadge';
import { FavoriteButton } from '@/components/article/FavoriteButton';
import { LikeButton } from '@/components/article/LikeButton';
import { XShareButton } from '@/components/article/XShareButton';
import { ViewCountTracker } from '@/components/article/ViewCountTracker';
import { DeleteArticleButton } from '@/components/article/DeleteArticleButton';
import { formatDate } from '@/lib/utils';
import type { Comment } from '@/lib/types';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('articles').select('title, excerpt, cover_image_url').eq('id', id).single();
  if (!data) return { title: '記事が見つかりません' };
  const title = data.title;
  const description = data.excerpt ?? undefined;
  const imageUrl = data.cover_image_url ?? undefined;
  return {
    title,
    description,
    openGraph: {
      title, description, type: 'article',
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title, description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      id, title, content, excerpt, cover_image_url, status, published_at, view_count, created_at, author_id,
      profiles!author_id ( id, username, display_name, avatar_url, bio ),
      article_tags ( tags ( id, name, slug ) )
    `)
    .eq('id', id)
    .single();

  if (error || !article || article.status !== 'published') notFound();

  const { data: { user } } = await supabase.auth.getUser();

  let isFavorited = false;
  let isLiked = false;
  let userRole: string | null = null;

  if (user) {
    const [favRes, likeRes, profileRes] = await Promise.all([
      supabase.from('favorites').select('id').eq('user_id', user.id).eq('article_id', id).single(),
      supabase.from('likes').select('id').eq('user_id', user.id).eq('article_id', id).single(),
      supabase.from('profiles').select('role').eq('id', user.id).single(),
    ]);
    isFavorited = !!favRes.data;
    isLiked = !!likeRes.data;
    userRole = profileRes.data?.role ?? null;
  }

  const canEdit = userRole === 'admin' || (userRole === 'writer' && article.author_id === user?.id);

  const { count: likesCount } = await supabase
    .from('likes').select('id', { count: 'exact', head: true }).eq('article_id', id);

  const { data: commentsData } = await supabase
    .from('comments')
    .select('id, article_id, user_id, content, created_at, updated_at, profiles ( username, display_name, avatar_url )')
    .eq('article_id', id)
    .order('created_at', { ascending: true });

  const comments = (commentsData ?? []) as unknown as Comment[];

  const author = article.profiles as unknown as {
    id: string; username: string; display_name: string | null; avatar_url: string | null; bio: string | null;
  };
  const tags = (article.article_tags as unknown as { tags: { id: string; name: string; slug: string } }[])
    .map((at) => at.tags).filter(Boolean);
  const authorName = author.display_name ?? author.username;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <ViewCountTracker articleId={article.id} />

      {/* カバー画像 */}
      {article.cover_image_url && (
        <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden mb-4">
          <Image src={article.cover_image_url} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      {/* タイトル・あらすじ */}
      <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">{article.title}</h1>
      {article.excerpt && (
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">{article.excerpt}</p>
      )}

      {/* メタ情報行 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {article.view_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likesCount ?? 0}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
        </div>
        {/* 著者（右寄せ） */}
        <Link href={'/writers/' + author.id} className="ml-auto flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {author.avatar_url ? (
              <Image src={author.avatar_url} alt={authorName} width={24} height={24} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500 text-[10px] font-bold">{authorName[0].toUpperCase()}</span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-700">{authorName}</span>
        </Link>
      </div>

      {/* 編集・削除ボタン */}
      {canEdit && (
        <div className="flex gap-2 mb-4">
          <Link href={'/articles/' + article.id + '/edit'}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-300 hover:text-blue-700 transition-colors">
            編集
          </Link>
          <DeleteArticleButton articleId={article.id} />
        </div>
      )}

      {/* 本文 */}
      <div className="mb-8">
        <ArticleContent content={article.content} />
      </div>

      {/* シェア・いいね・保存 */}
      <div className="flex flex-wrap items-center gap-3 py-4 border-t border-b border-gray-100 mb-6">
        <p className="text-xs font-semibold text-gray-500 mr-1">この記事を共有 &gt;</p>
        <XShareButton title={article.title} url={siteUrl + '/articles/' + article.id} />
        {user ? (
          <>
            <LikeButton articleId={article.id} initialIsLiked={isLiked} initialCount={likesCount ?? 0} />
            <FavoriteButton articleId={article.id} initialIsFavorited={isFavorited} />
          </>
        ) : (
          <Link href="/login" className="text-xs text-blue-600 hover:underline">ログインしていいね・保存できます</Link>
        )}
      </div>

      {/* 著者カード */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
        <p className="text-xs font-semibold text-gray-400 shrink-0">この記事を書いた人 &gt;</p>
        <Link href={'/writers/' + author.id} className="flex items-center gap-3 flex-1 min-w-0 group">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {author.avatar_url ? (
              <Image src={author.avatar_url} alt={authorName} width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500 font-bold">{authorName[0].toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{authorName}</p>
            {author.bio && <p className="text-xs text-gray-500 line-clamp-1">{author.bio}</p>}
          </div>
        </Link>
        <Link href={'/writers/' + author.id}
          className="flex-shrink-0 text-xs border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:border-blue-300 hover:text-blue-700 transition-colors">
          記事一覧 &gt;
        </Link>
      </div>
    </div>
  );
}
