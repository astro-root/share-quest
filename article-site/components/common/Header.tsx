'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
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
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value ?? '';
    router.push('/search' + (q ? '?q=' + encodeURIComponent(q) : ''));
  };
  return (
    <header className="sticky top-0 z-50 bg-blue-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* 左：検索 */}
        <form onSubmit={handleSearch} className="flex items-center gap-1 bg-white rounded overflow-hidden w-48 sm:w-64 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            placeholder="検索"
            className="flex-1 px-3 py-1.5 text-sm text-gray-800 outline-none"
          />
          <button type="submit" className="px-2 py-1.5 text-blue-800 hover:bg-blue-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </form>

        {/* 中央：ロゴ */}
        <Link href="/articles" className="absolute left-1/2 -translate-x-1/2 text-white font-extrabold text-xl tracking-wide hover:opacity-80 transition-opacity whitespace-nowrap">
          SHARE Quest
        </Link>

        {/* 右：ナビ */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              {canWrite && (
                <Link href="/articles/new"
                  className="rounded border border-white/60 px-3 py-1 text-xs font-medium text-white hover:bg-white hover:text-blue-800 transition-colors">
                  投稿する
                </Link>
              )}
              <Link href={myPageHref} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-white/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt="アバター" width={28} height={28} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-white text-xs font-bold">
                      {(profile?.display_name ?? profile?.username ?? '?')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-white text-xs hidden sm:block font-medium">
                  {profile?.display_name ?? profile?.username}
                </span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login"
              className="rounded border border-white/60 px-3 py-1 text-xs font-medium text-white hover:bg-white hover:text-blue-800 transition-colors">
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
