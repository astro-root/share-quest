'use client';
import { useActionState } from 'react';
import { updateProfile } from '@/actions/article';
import { AvatarUploader } from '@/components/profile/AvatarUploader';
import { useState } from 'react';

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
}
interface Props { profile: Profile; isWriter: boolean }
const initial = { error: undefined, success: false };

export function ProfileEditForm({ profile, isWriter }: Props) {
  const [state, action, pending] = useActionState(updateProfile, initial);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '');

  return (
    <form action={action} className="space-y-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">保存しました</p>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">アイコン画像</label>
        <AvatarUploader userId={profile.id} currentAvatarUrl={avatarUrl} onUpload={setAvatarUrl} />
        <input type="hidden" name="avatar_url" value={avatarUrl} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="display_name">表示名</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={profile.display_name ?? ''}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition"
        />
      </div>

      {isWriter && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="username">ユーザーネーム</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={profile.username}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="bio">自己紹介</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile.bio ?? ''}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 resize-none focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition"
            />
          </div>
        </>
      )}

      {!isWriter && (
        <>
          <input type="hidden" name="username" value={profile.username} />
          <input type="hidden" name="bio" value={profile.bio ?? ''} />
        </>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-sm font-semibold text-white disabled:opacity-50 transition-colors"
      >
        {pending ? '保存中...' : '保存する'}
      </button>
    </form>
  );
}
