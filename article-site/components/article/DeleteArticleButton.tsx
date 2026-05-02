'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { deleteArticle } from '@/actions/article';

const initial = { error: undefined, success: false };

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const [state, action, pending] = useActionState(deleteArticle, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.push('/articles');
  }, [state.success, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm('この記事を削除しますか？この操作は取り消せません。')) {
      e.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="article_id" value={articleId} />
      {state.error && <p className="text-xs text-red-500 mt-1">{state.error}</p>}
      <button
        type="submit" disabled={pending}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:border-red-400 disabled:opacity-50 transition-colors"
      >
        {pending ? '削除中...' : '記事を削除'}
      </button>
    </form>
  );
}
