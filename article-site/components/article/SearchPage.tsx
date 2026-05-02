'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArticleCard } from '@/components/article/ArticleCard';
import type { ArticleWithDetails } from '@/lib/types';

interface Tag { id: string; name: string; slug: string }
interface Writer { id: string; username: string; display_name: string | null; avatar_url: string | null }
interface Props {
  tags: Tag[];
  writers: Writer[];
  currentQ: string;
  currentTag: string;
  currentWriter: string;
  articles: ArticleWithDetails[];
  isFiltering: boolean;
}

export function SearchPage({ tags, writers, currentQ, currentTag, currentWriter, articles, isFiltering }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTag, setSelectedTag] = useState(currentTag);
  const [selectedWriter, setSelectedWriter] = useState(currentWriter);

  const search = (q: string, tag: string, writer: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (tag) params.set('tag', tag);
    if (writer) params.set('writer', writer);
    router.push('/search' + (params.toString() ? '?' + params.toString() : ''));
  };

  const handleTagClick = (slug: string) => {
    const next = selectedTag === slug ? '' : slug;
    setSelectedTag(next);
    search(inputRef.current?.value ?? currentQ, next, selectedWriter);
  };

  const handleWriterClick = (id: string) => {
    const next = selectedWriter === id ? '' : id;
    setSelectedWriter(next);
    search(inputRef.current?.value ?? currentQ, selectedTag, next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(inputRef.current?.value ?? '', selectedTag, selectedWriter);
  };

  return (
    <div>
      <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">検索</h1>

      {/* 検索バー */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          defaultValue={currentQ}
          placeholder="キーワードで検索..."
          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors">
          検索
        </button>
      </form>

      {/* タグでしぼる */}
      {tags.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">タグでしぼる</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button key={tag.id} onClick={() => handleTagClick(tag.slug)}
                className={['px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                  selectedTag === tag.slug ? 'bg-blue-700 text-white border-blue-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300'].join(' ')}>
                #{tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <hr className="border-gray-100 dark:border-gray-700 mb-5" />

      {/* ライターでしぼる */}
      {writers.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">ライターでしぼる</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {writers.map((w) => {
              const name = w.display_name ?? w.username;
              const selected = selectedWriter === w.id;
              return (
                <button key={w.id} onClick={() => handleWriterClick(w.id)}
                  className={['flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-colors',
                    selected ? 'bg-blue-700 text-white border-blue-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300'].join(' ')}>
                  <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {w.avatar_url ? (
                      <Image src={w.avatar_url} alt={name} width={28} height={28} className="object-cover w-full h-full" />
                    ) : (
                      <span className={`text-xs font-bold ${selected ? 'text-white' : 'text-gray-500'}`}>{name[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium truncate">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 検索結果 */}
      {isFiltering && (
        <div>
          <h2 className="text-sm font-bold text-blue-800 dark:text-blue-400 border-b-2 border-blue-800 dark:border-blue-400 pb-1 mb-3">
            検索結果 <span className="text-gray-400 dark:text-gray-500 font-normal">{articles.length}件</span>
          </h2>
          {articles.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">条件に一致する記事がありません</p>
          ) : (
            <div>{articles.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
          )}
        </div>
      )}
    </div>
  );
}
