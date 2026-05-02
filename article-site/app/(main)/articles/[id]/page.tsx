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
import { CommentSection } from '@/components/article/CommentSection';
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
      title,
      description,
      type: 'article',
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
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

  const canDelete = userRole === 'admin' ||
    (userRole === 'writer' && article.author_id === user?.id);

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

  return (
    <div className="max-w-3xl mx-auto">
      {/* クライアント側で1回だけ閲覧数を加算 */}
      <ViewCountTracker articleId={article.id} />

      <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {article.cover_image_url && (
          <div className="relative w-full h-64 md:h-80">
            <Image src={article.cover_image_url} alt={article.title} fill className="object-cover" priority />
          </div>
        )}
        <div className="p-6 md:p-10">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-5 leading-snug">{article.title}</h1>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <Link href={'/writers/' + author.id} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {author.avatar_url ? (
                  <Image src={author.avatar_url} alt={authorName} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-500 font-bold">{authorName[0].toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{authorName}</p>
                <p className="text-xs text-gray-400">
                  {article.published_at ? formatDate(article.published_at) : formatDate(article.created_at)}
                </p>
              </div>
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-gray-400">{article.view_count.toLocaleString()} 回閲覧</span>
              {canDelete && (
                <div className="flex items-center gap-2">
                  <Link href={'/articles/' + article.id + '/edit'}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    編集
                  </Link>
                  <DeleteArticleButton articleId={article.id} />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-8">
            <XShareButton
              title={article.title}
              url={(process.env.NEXT_PUBLIC_SITE_URL ?? '') + '/articles/' + article.id}
            />
            {user ? (
              <>
                <LikeButton articleId={article.id} initialIsLiked={isLiked} initialCount={likesCount ?? 0} />
                <FavoriteButton articleId={article.id} initialIsFavorited={isFavorited} />
              </>
            ) : (
              <span className="text-xs text-gray-400 ml-2">
                <Link href="/login" className="text-indigo-500 hover:underline">ログイン</Link>
                していいね・保存できます
              </span>
            )}
          </div>
          <ArticleContent content={article.content} />
          <CommentSection articleId={article.id} initialComments={comments} currentUserId={user?.id ?? null} />
        </div>
      </article>
      <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
        <Link href={'/writers/' + author.id} className="flex items-center gap-3 group flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {author.avatar_url ? (
              <Image src={author.avatar_url} alt={authorName} width={48} height={48} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500 text-lg font-bold">{authorName[0].toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">ライター</p>
            <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{authorName}</p>
            {author.bio && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{author.bio}</p>}
          </div>
        </Link>
        <Link href={'/writers/' + author.id}
          className="flex-shrink-0 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
          記事を見る
        </Link>
      </div>
    </div>
  );
}
