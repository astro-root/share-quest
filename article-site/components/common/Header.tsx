import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface HeaderProps {
  user: User | null;
  profile: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'role'> | null;
}

export function Header({ user, profile }: HeaderProps) {
  const canWrite = profile?.role === 'writer' || profile?.role === 'admin';
  const myPageHref = canWrite ? '/profile/edit' : '/mypage';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/articles" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            SHARE Quest
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {canWrite && (
                <Link href="/articles/new"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                  投稿する
                </Link>
              )}
              <Link href={myPageHref}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt="アバター" width={32} height={32} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-500 text-xs font-semibold">
                      {(profile?.display_name ?? profile?.username ?? '?')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-700 hidden sm:block font-medium">
                  {profile?.display_name ?? profile?.username}
                </span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              ログイン / 新規登録
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
