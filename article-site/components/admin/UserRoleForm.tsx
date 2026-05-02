'use client';

import { useActionState } from 'react';
import { updateUserRole } from '@/actions/admin';

interface Props {
  userId: string;
  currentRole: string;
}

const initial = { error: undefined, success: false };

const ROLES = [
  { value: 'reader', label: '閲覧者' },
  { value: 'writer', label: 'ライター' },
  { value: 'admin',  label: '編集長' },
];

export function UserRoleForm({ userId, currentRole }: Props) {
  const [state, action, pending] = useActionState(updateUserRole, initial);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="user_id" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-indigo-400 focus:outline-none"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      <button
        type="submit" disabled={pending}
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {pending ? '保存中' : '変更'}
      </button>
      {state.success && <span className="text-xs text-green-600">✓ 更新しました</span>}
      {state.error && <span className="text-xs text-red-500">{state.error}</span>}
    </form>
  );
}
