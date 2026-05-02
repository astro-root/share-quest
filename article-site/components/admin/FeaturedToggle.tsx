'use client';

import { useActionState } from 'react';
import { toggleFeatured } from '@/actions/admin';

const initial = { error: undefined, success: false, isFeatured: undefined };

export function FeaturedToggle({ articleId, initialIsFeatured }: { articleId: string; initialIsFeatured: boolean }) {
  const [state, action, pending] = useActionState(toggleFeatured, initial);
  const isFeatured = state.isFeatured ?? initialIsFeatured;

  return (
    <form action={action}>
      <input type="hidden" name="article_id" value={articleId} />
      <button type="submit" disabled={pending}
        className={[
          'rounded-full px-3 py-1 text-xs font-medium border transition-colors',
          isFeatured
            ? 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200'
            : 'bg-white border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-600',
          pending ? 'opacity-50' : ''
        ].join(' ')}>
        {isFeatured ? '★ おすすめ中' : '☆ おすすめ設定'}
      </button>
    </form>
  );
}
