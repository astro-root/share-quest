'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { ArticleWithDetails } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { toggleFavorite } from '@/actions/article';

interface Props {
  article: ArticleWithDetails;
  initialIsFavorited?: boolean;
  isLoggedIn?: boolean;
}

export function ArticleCard({ article, initialIsFavorited = false, isLoggedIn = false }: Props) {
  const author = article.profiles;
  const displayName = author.display_name ?? author.username;
  const [favorited, setFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append('article_id', article.id);
    await toggleFavorite({ success: false, isFavorited: favorited }, fd);
    setFavorited(!favorited);
    setLoading(false);
  };

  return (
    <div className="relative flex items-stretch border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      {/* ☆ 右上 */}
      <button
        onClick={handleFavorite}
        disabled={loading}
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
        aria-label="お気に入り"
      >
        <svg className={['w-5 h-5 transition-colors', favorited ? 'fill-yellow-400 stroke-yellow-400' : 'fill-none stroke-gray-400 hover:stroke-yellow-400'].join(' ')}
          viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>

      {/* サムネイル（左・大きめ） */}
      <Link href={'/articles/' + article.id} className="flex-shrink-0">
        <div className="relative w-28 h-full min-h-[80px] sm:w-36 bg-gray-100">
          {article.cover_image_url ? (
            <Image src={article.cover_image_url} alt={article.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 min-h-[80px]">
              <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* タイトル・メタ情報（右） */}
      <div className="flex-1 min-w-0 p-3 pr-8">
        <Link href={'/articles/' + article.id}>
          <p className="text-base font-bold text-gray-900 hover:text-blue-700 transition-colors leading-snug line-clamp-3">
            {article.title}
          </p>
        </Link>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="text-xs text-gray-400">
            {article.published_at ? formatDate(article.published_at) : formatDate(article.created_at)}
          </span>
          <span className="text-xs text-gray-300">·</span>
          <Link href={'/writers/' + author.username} className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
            {displayName}
          </Link>
        </div>
      </div>
    </div>
  );
}
