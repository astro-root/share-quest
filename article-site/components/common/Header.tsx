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
    <header className="sticky top-0 z-50 bg-[#0f1f3d] dark:bg-[#0a1628] border-b border-white/10 shadow-lg">
      <div className="max-w-6xl mx-auto px-5 py-0 flex items-center justify-between h-16">

        {/* ロゴ */}
        <Link href="/" className="flex flex-col items-start leading-tight group shrink-0">
          <span className="text-white font-black text-lg tracking-widest uppercase group-hover:text-blue-300 transition-colors duration-200">
            SHARE<span className="text-blue-400"> Quest</span>
          </span>
          <span className="text-blue-300/60 text-[8px] tracking-widest font-medium">
            — 学びの「楽しい！」をつなげる —
          </span>
        </Link>

        {/* 右：デスクトップ */}
        <nav className="hidden sm:flex items-center gap-1 ml-auto">
          <NavIcon href="/search" label="検索">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </NavIcon>
          <NavIcon href="/writers" label="ライター一覧">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8z" />
          </NavIcon>
          <NavIcon href={user ? '/mypage' : '/login'} label="お気に入り">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </NavIcon>
          <NavIcon href="/settings" label="設定">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </NavIcon>

          <div className="w-px h-5 bg-white/20 mx-2" />

          {(isWriter || isAdmin) && (
            <Link href="/articles/new"
              className="ml-1 px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold tracking-wide transition-all duration-200 shadow-md shadow-blue-900/40 hover:shadow-blue-500/30">
              ✏️ 投稿する
            </Link>
          )}
          {!user && (
            <Link href="/login"
              className="ml-1 px-4 py-1.5 rounded-full border border-white/30 hover:border-blue-400 hover:text-blue-300 text-white text-xs font-medium tracking-wide transition-all duration-200">
              ログイン
            </Link>
          )}
        </nav>

        {/* ハンバーガー（モバイル） */}
        <button
          className="sm:hidden ml-auto p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className="sm:hidden bg-[#0a1628] border-t border-white/10 px-5 py-4 flex flex-col gap-1">
          {[
            { href: '/search', label: '検索' },
            { href: '/writers', label: 'ライター一覧' },
            { href: user ? '/mypage' : '/login', label: 'お気に入り' },
            { href: '/settings', label: '設定' },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="text-white/70 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          {(isWriter || isAdmin) && (
            <Link href="/articles/new"
              className="mt-2 text-center px-4 py-2.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold transition-colors"
              onClick={() => setMenuOpen(false)}>
              ✏️ 投稿する
            </Link>
          )}
          {!user && (
            <Link href="/login"
              className="mt-2 text-center px-4 py-2.5 rounded-full border border-white/30 text-white text-sm font-medium transition-colors"
              onClick={() => setMenuOpen(false)}>
              ログイン
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

function NavIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="p-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
      title={label}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {children}
      </svg>
    </Link>
  );
}
