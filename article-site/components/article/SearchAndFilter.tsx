'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useRef } from 'react';
interface Tag { id: string; name: string; slug: string }
interface Props { tags: Tag[]; currentQ: string; currentTag: string }
export function SearchAndFilter({ tags, currentQ, currentTag }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = useCallback((q: string, tag: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (tag) params.set('tag', tag);
    router.push(pathname + (params.toString() ? '?' + params.toString() : ''));
  }, [router, pathname]);
  const handleSearchChange = useCallback((value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      update(value, currentTag);
    }, 300);
  }, [update, currentTag]);
  return (
    <div className="space-y-3 mb-8">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text" placeholder="記事を検索..." defaultValue={currentQ}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => update(currentQ, '')}
            className={['px-3 py-1 rounded-full text-xs font-medium transition-colors',
              currentTag === '' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'].join(' ')}>
            すべて
          </button>
          {tags.map((tag) => (
            <button key={tag.id} onClick={() => update(currentQ, tag.slug === currentTag ? '' : tag.slug)}
              className={['px-3 py-1 rounded-full text-xs font-medium transition-colors',
                tag.slug === currentTag ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'].join(' ')}>
              #{tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
