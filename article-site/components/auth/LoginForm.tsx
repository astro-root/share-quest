'use client';

import { useActionState } from 'react';
import { signIn } from '@/actions/auth';

const initialState = { error: undefined };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initialState);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
          メールアドレス
        </label>
        <input
          id="email" name="email" type="email" required autoComplete="email"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
          パスワード
        </label>
        <input
          id="password" name="password" type="password" required autoComplete="current-password"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <button
        type="submit" disabled={pending}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {pending ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}
