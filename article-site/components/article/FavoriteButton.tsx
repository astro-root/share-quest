'use client';
import { useActionState } from 'react';
import { toggleFavorite } from '@/actions/article';
type Props = {
  articleId: string;
  initialIsFavorited: boolean;
};
export function FavoriteButton({ articleId, initialIsFavorited }: Props) {
  const [state, formAction, pending] = useActionState(toggleFavorite, {
    isFavorited: initialIsFavorited,
  });
  const isFavorited = state.isFavorited ?? initialIsFavorited;
  return (
    <form action={formAction}>
      <input type="hidden" name="article_id" value={articleId} />
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
          isFavorited
            ? 'bg-yellow-50 border-yellow-300 text-yellow-500 hover:bg-yellow-100'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-yellow-300 hover:text-yellow-500'
        } ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{isFavorited ? '★' : '☆'}</span>
        <span>{isFavorited ? 'お気に入り済み' : 'お気に入り'}</span>
      </button>
    </form>
  );
}
