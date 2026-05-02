import Link from 'next/link';
import Image from 'next/image';
import type { ArticleWithDetails } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface Props { article: ArticleWithDetails; showFavorite?: boolean }

export function ArticleCard({ article, showFavorite = true }: Props) {
  const author = article.profiles;
  const displayName = author.display_name ?? author.username;

  return (
    <div className="flex items-center gap-3 border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      {/* サムネ */}
      <Link href={'/articles/' + article.id} className="flex-shrink-0">
        <div className="relative w-24 h-16 sm:w-28 sm:h-18 bg-gray-100">
          {article.cover_image_url ? (
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* タイトル */}
      <div className="flex-1 min-w-0 py-2 pr-1">
        <Link href={'/articles/' + article.id}>
          <p className="text-sm font-bold text-gray-900 hover:text-blue-700 transition-colors leading-snug line-clamp-2">
            {article.title}
          </p>
        </Link>
        <p className="text-xs text-gray-400 mt-1">
          {article.published_at ? formatDate(article.published_at) : formatDate(article.created_at)}
          　<Link href={'/writers/' + author.id} className="hover:text-blue-600 transition-colors">{displayName}</Link>
        </p>
      </div>

      {/* ☆ お気に入りアイコン */}
      {showFavorite && (
        <div className="flex-shrink-0 pr-3">
          <Link href="/login" className="text-gray-300 hover:text-yellow-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
