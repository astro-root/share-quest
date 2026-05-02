'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';

interface HeaderProps {
  user: User | null;
  profile: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'role'> | null;
}

export function Header({ user, profile }: HeaderProps) {
  const isWriter = profile?.role === 'writer';
  const isAdmin = profile?.role === 'admin';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-blue-800 shadow-md">
      <div className="max-w-2xl lg:max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* 中央：ロゴ（左寄せ on mobile, absolute center on lg） */}
        <Link href="/" className="flex flex-col items-start lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:items-center leading-tight">
          <span className="text-white font-extrabold text-xl tracking-wide">SHARE Quest</span>
          <span className="text-blue-200 text-[9px] tracking-wide">-学びの「楽しい！」をつなげる-</span>
        </Link>

        {/* 右：アイコン群（デスクトップ） */}
        <div className="hidden sm:flex items-center gap-4 ml-auto flex-shrink-0">
          {/* 検索 */}
          <Link href="/search" className="text-white hover:text-blue-200 transition-colors" title="検索">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </Link>
          {/* ライター */}
          <Link href="/writers" className="text-white hover:text-blue-200 transition-colors" title="ライター一覧">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </Link>
          {/* お気に入り */}
          <Link href={user ? '/mypage' : '/login'} className="text-white hover:text-blue-200 transition-colors" title="お気に入り">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </Link>
          {/* 設定 */}
          <Link href="/settings" className="text-white hover:text-blue-200 transition-colors" title="設定">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
          {/* 投稿する */}
          {(isWriter || isAdmin) && (
            <Link href="/articles/new"
              className="rounded border border-white/60 px-3 py-1 text-xs font-medium text-white hover:bg-white hover:text-blue-800 transition-colors">
              投稿する
            </Link>
          )}
          {/* ログイン */}
          {!user && (
            <Link href="/login"
              className="rounded border border-white/60 px-3 py-1 text-xs font-medium text-white hover:bg-white hover:text-blue-800 transition-colors">
              ログイン
            </Link>
          )}
        </div>

        {/* ハンバーガー（モバイル） */}
        <button
          className="sm:hidden ml-auto text-white hover:text-blue-200 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className="sm:hidden bg-blue-900 px-4 py-3 flex flex-col gap-3 border-t border-blue-700">
          <Link href="/search" className="text-white hover:text-blue-200 text-sm flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            検索
          </Link>
          <Link href="/writers" className="text-white hover:text-blue-200 text-sm flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            ライター一覧
          </Link>
          <Link href={user ? '/mypage' : '/login'} className="text-white hover:text-blue-200 text-sm flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            お気に入り
          </Link>
          <Link href="/settings" className="text-white hover:text-blue-200 text-sm flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            設定
          </Link>
          {(isWriter || isAdmin) && (
            <Link href="/articles/new" className="text-white hover:text-blue-200 text-sm flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              ✏️ 投稿する
            </Link>
          )}
          {!user && (
            <Link href="/login" className="text-white hover:text-blue-200 text-sm" onClick={() => setMenuOpen(false)}>
              ログイン
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
