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
      <article className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
        <div className="relative h-52 w-full">
          <Image src={article.cover_image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {article.tags.slice(0, 3).map((tag) => <TagBadge key={tag.id} tag={tag} />)}
            </div>
          )}
          <Link href={'/articles/' + article.id} className="block">
            <h2 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
              {article.title}
            </h2>
          </Link>
          <div className="flex items-center gap-2 mt-2 text-white/70 text-xs">
            <span>{article.published_at ? formatDate(article.published_at) : formatDate(article.created_at)}</span>
            <span>·</span>
            <Link href={'/writers/' + author.id} className="hover:text-white transition-colors">{displayName}</Link>
          </div>
        </div>
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
          おすすめ
        </span>
      </article>
    );
  }

  return (
    <article className="flex gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group">
      {article.cover_image_url && (
        <Link href={'/articles/' + article.id} className="flex-shrink-0">
          <div className="relative w-28 h-20 rounded-lg overflow-hidden">
            <Image src={article.cover_image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </Link>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {article.tags.length > 0 && (
            <p className="text-xs text-blue-700 font-semibold mb-0.5">{article.tags[0].name}</p>
          )}
          <Link href={'/articles/' + article.id}>
            <h2 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
              {article.title}
            </h2>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <span>{article.published_at ? formatDate(article.published_at) : formatDate(article.created_at)}</span>
          <span>·</span>
          <Link href={'/writers/' + author.id} className="hover:text-blue-600 transition-colors">{displayName}</Link>
        </div>
      </div>
    </article>
  );
}
