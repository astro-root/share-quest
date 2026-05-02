'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { addComment, deleteComment } from '@/actions/article';
import type { Comment } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface Props {
  articleId: string;
  initialComments: Comment[];
  currentUserId: string | null;
}

const addInitial = { error: undefined, success: false };
const delInitial = { error: undefined, success: false };

export function CommentSection({ articleId, initialComments, currentUserId }: Props) {
  const [addState, addAction, addPending] = useActionState(addComment, addInitial);

  return (
    <section className="mt-10 pt-8 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        コメント <span className="text-gray-400 font-normal text-base">({initialComments.length})</span>
      </h2>
      {currentUserId ? (
        <form action={addAction} className="mb-8">
          <input type="hidden" name="article_id" value={articleId} />
          {addState.error && <p className="text-sm text-red-500 mb-2">{addState.error}</p>}
          {addState.success && <p className="text-sm text-green-600 mb-2">コメントを投稿しました</p>}
          <textarea
            name="content" placeholder="コメントを入力（500文字以内）" maxLength={500} rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <div className="mt-2 flex justify-end">
            <button type="submit" disabled={addPending}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {addPending ? '投稿中...' : '投稿する'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-400 mb-8 bg-gray-50 rounded-xl px-4 py-3">
          コメントするには
          <a href="/login" className="text-indigo-600 hover:underline mx-1">ログイン</a>
          が必要です
        </p>
      )}
      <div className="space-y-4">
        {initialComments.length === 0 ? (
          <p className="text-center text-gray-400 py-8">まだコメントがありません</p>
        ) : (
          initialComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} articleId={articleId} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </section>
  );
}

function CommentItem({ comment, articleId, currentUserId }: { comment: Comment; articleId: string; currentUserId: string | null }) {
  const [state, action, pending] = useActionState(deleteComment, delInitial);
  const displayName = comment.profiles.display_name ?? comment.profiles.username;

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center mt-0.5">
        {comment.profiles.avatar_url ? (
          <Image src={comment.profiles.avatar_url} alt={displayName} width={32} height={32} className="object-cover" />
        ) : (
          <span className="text-gray-500 text-xs font-bold">{displayName[0].toUpperCase()}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{displayName}</span>
          <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        {state.error && <p className="text-xs text-red-500 mt-1">{state.error}</p>}
      </div>
      {currentUserId === comment.user_id && (
        <form action={action} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <input type="hidden" name="comment_id" value={comment.id} />
          <input type="hidden" name="article_id" value={articleId} />
          <button type="submit" disabled={pending}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-1">
            削除
          </button>
        </form>
      )}
    </div>
  );
}
