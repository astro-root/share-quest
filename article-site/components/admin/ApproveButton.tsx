'use client';

import { useActionState } from 'react';
import { approveArticle } from '@/actions/article';

const initial = { error: undefined, success: false };

export function ApproveButton({ articleId }: { articleId: string }) {
  const [state, action, pending] = useActionState(approveArticle, initial);

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {state.error && <span className="text-xs text-red-500">{state.error}</span>}
      {state.success && <span className="text-xs text-green-600">✓</span>}
      <form action={action} className="flex gap-2">
        <input type="hidden" name="articleId" value={articleId} />
        <button name="action" value="approve" type="submit" disabled={pending}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
          承認
        </button>
        <button name="action" value="reject" type="submit" disabled={pending}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
          差戻
        </button>
      </form>
    </div>
  );
}
