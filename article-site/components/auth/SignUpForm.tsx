'use client';

import { useActionState } from 'react';
import { signUp } from '@/actions/auth';

const initialState = { error: undefined, success: false };

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, initialState);

  if (state.success) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
        <p className="text-green-700 font-medium mb-1">確認メールを送信しました</p>
        <p className="text-sm text-green-600">メールのリンクをクリックして登録を完了してください</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signup-name">
          表示名
        </label>
        <input
          id="signup-name" name="display_name" type="text" placeholder="表示名（後から変更可）"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signup-email">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="signup-email" name="email" type="email" required autoComplete="email"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signup-password">
          パスワード <span className="text-red-500">*</span>
        </label>
        <input
          id="signup-password" name="password" type="password" required minLength={8}
          autoComplete="new-password" placeholder="8文字以上"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <button
        type="submit" disabled={pending}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {pending ? '登録中...' : 'アカウントを作成'}
      </button>
    </form>
  );
}
