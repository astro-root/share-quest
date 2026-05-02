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
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isFavorited
            ? 'bg-pink-50 text-pink-600 hover:bg-pink-100'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        <span>{isFavorited ? '♥' : '♡'}</span>
        <span>{isFavorited ? 'お気に入り済み' : 'お気に入り'}</span>
      </button>
    </form>
  );
}
