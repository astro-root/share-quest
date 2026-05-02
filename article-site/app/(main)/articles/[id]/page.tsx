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
  let favoritesCount = 0;
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

  const { count: favCount } = await supabase
    .from('favorites').select('id', { count: 'exact', head: true }).eq('article_id', id);

  favoritesCount = favCount ?? 0;

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
        <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-4">
          <Image src={article.cover_image_url} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      {/* タイトル */}
      <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">{article.title}</h1>

      {/* あらすじ */}
      {article.excerpt && (
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{article.excerpt}</p>
      )}

      {/* いいね数・お気に入り数・タグ・著者 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* いいね数 */}
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {(likesCount ?? 0).toLocaleString()}
          </span>
          {/* お気に入り数 */}
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {favoritesCount.toLocaleString()}
          </span>
        </div>

        {/* タグ */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
        </div>

        {/* この記事を書いた人（右寄せ） */}
        <Link href={'/writers/' + author.id} className="ml-auto flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {author.avatar_url ? (
              <Image src={author.avatar_url} alt={authorName} width={24} height={24} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500 text-[10px] font-bold">{authorName[0].toUpperCase()}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">この記事を書いた人</span>
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
      <div className="mb-10">
        <ArticleContent content={article.content} />
      </div>

      {/* フッター：シェア | 著者カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
        {/* この記事を共有 */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500">この記事を共有 &gt;</p>
          <div className="flex items-center gap-3">
            <XShareButton title={article.title} url={siteUrl + '/articles/' + article.id} />
            {/* LINEシェア */}
            <a href={'https://line.me/R/msg/text/?' + encodeURIComponent(article.title + ' ' + siteUrl + '/articles/' + article.id)} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-xs font-medium transition-colors">LINE</a>
          </div>
          {/* いいね・保存 */}
          <div className="flex items-center gap-3 mt-1">
            {user ? (
              <>
                <LikeButton articleId={article.id} initialIsLiked={isLiked} initialCount={likesCount ?? 0} />
                <FavoriteButton articleId={article.id} initialIsFavorited={isFavorited} />
              </>
            ) : (
              <Link href="/login" className="text-xs text-blue-600 hover:underline">ログインしていいね・保存できます</Link>
            )}
          </div>
        </div>

        {/* この記事を書いた人 */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500">この記事を書いた人 &gt;</p>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {author.avatar_url ? (
                <Image src={author.avatar_url} alt={authorName} width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-500 font-bold">{authorName[0].toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{authorName}</p>
              {author.bio && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{author.bio}</p>}
            </div>
            <Link href={'/writers/' + author.id}
              className="flex-shrink-0 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-500 hover:border-blue-300 hover:text-blue-700 transition-colors whitespace-nowrap">
              プロフィールへ &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
