'use client';

import { useActionState } from 'react';
import { toggleLike } from '@/actions/article';

interface Props { articleId: string; initialIsLiked: boolean; initialCount: number }

const initial = { error: undefined, isLiked: undefined };

export function LikeButton({ articleId, initialIsLiked, initialCount }: Props) {
  const [state, action, pending] = useActionState(toggleLike, initial);
  const isLiked = state.isLiked ?? initialIsLiked;
  const count = state.isLiked === true
    ? initialCount + 1
    : state.isLiked === false
    ? Math.max(0, initialCount - 1)
    : initialCount;

  return (
    <form action={action}>
      <input type="hidden" name="article_id" value={articleId} />
      <button type="submit" disabled={pending}
        className={['flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all',
          isLiked ? 'bg-pink-50 border-pink-300 text-pink-600 hover:bg-pink-100' : 'bg-white border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-500',
          pending ? 'opacity-50 cursor-not-allowed' : ''].join(' ')}>
        <span>{isLiked ? '❤️' : '🤍'}</span>
        <span>{count}</span>
      </button>
    </form>
  );
}
