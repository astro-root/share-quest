import Link from 'next/link';
import Image from 'next/image';
import type { ArticleWithDetails } from '@/lib/types';
import { TagBadge } from '@/components/article/TagBadge';
import { formatDate } from '@/lib/utils';

interface Props { article: ArticleWithDetails; featured?: boolean }

export function ArticleCard({ article, featured = false }: Props) {
  const author = article.profiles;
  const displayName = author.display_name ?? author.username;

  if (featured && article.cover_image_url) {
    return (
      <article className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
        <div className="relative h-56 w-full">
          <Image src={article.cover_image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {article.tags.slice(0, 3).map((tag) => <TagBadge key={tag.id} tag={tag} />)}
            </div>
          )}
          <Link href={'/articles/' + article.id} className="block">
            <h2 className="text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
              {article.title}
            </h2>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full bg-white/30 overflow-hidden flex-shrink-0">
              {author.avatar_url ? (
                <Image src={author.avatar_url} alt={displayName} width={20} height={20} className="object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-white text-[9px] font-bold">{displayName[0].toUpperCase()}</span>
              )}
            </div>
            <Link href={'/writers/' + author.id} className="text-white/80 text-xs hover:text-white transition-colors font-medium">
              {displayName}
            </Link>
            <span className="text-white/60 text-xs ml-auto">{article.view_count.toLocaleString()} 閲覧</span>
          </div>
        </div>
        <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full shadow">
          ★ おすすめ
        </span>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group border border-gray-100">
      {article.cover_image_url && (
        <Link href={'/articles/' + article.id} className="block overflow-hidden">
          <div className="relative h-44 w-full">
            <Image src={article.cover_image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </Link>
      )}
      <div className="p-5 flex flex-col flex-1">
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {article.tags.slice(0, 4).map((tag) => <TagBadge key={tag.id} tag={tag} />)}
          </div>
        )}
        <Link href={'/articles/' + article.id} className="group/title flex-1">
          <h2 className="text-base font-bold text-gray-900 group-hover/title:text-indigo-600 transition-colors leading-snug line-clamp-3">
            {article.title}
          </h2>
        </Link>
        {article.excerpt && (
          <p className="text-xs text-gray-400 line-clamp-2 mt-2">{article.excerpt}</p>
        )}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2">
          <Link href={'/writers/' + author.id} className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors min-w-0">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {author.avatar_url ? (
                <Image src={author.avatar_url} alt={displayName} width={24} height={24} className="object-cover" />
              ) : (
                <span className="text-gray-500 text-[10px] font-bold">{displayName[0].toUpperCase()}</span>
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium truncate">{displayName}</span>
          </Link>
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
            <span>{article.published_at ? formatDate(article.published_at) : formatDate(article.created_at)}</span>
            <span>·</span>
            <span>{article.view_count.toLocaleString()} 閲覧</span>
          </div>
        </div>
      </div>
    </article>
  );
}
