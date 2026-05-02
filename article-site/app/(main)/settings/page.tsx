'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | null;
    if (savedSize) setFontSize(savedSize);
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDark);
    if (savedDark) document.documentElement.classList.add('dark');

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  const handleFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    const map = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = map[size];
  };

  const handleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('darkMode', String(enabled));
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
        <Link href="/" className="text-gray-400 hover:text-blue-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-bold text-gray-900">設定</h1>
      </div>

      <div className="space-y-4">
        {/* アカウント */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">アカウント</p>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="inline-block rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50">
              {loading ? 'ログアウト中...' : 'ログアウト'}
            </button>
          ) : (
            <Link href="/login"
              className="inline-block rounded-lg bg-blue-800 text-white px-4 py-2 text-sm font-medium hover:bg-blue-900 transition-colors">
              ログイン / 新規登録
            </Link>
          )}
        </div>

        {/* 文字サイズ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">文字サイズ</p>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => {
              const label = size === 'small' ? '小' : size === 'medium' ? '中' : '大';
              return (
                <button
                  key={size}
                  onClick={() => handleFontSize(size)}
                  className={['flex-1 py-2 rounded-lg border text-sm font-medium transition-colors',
                    fontSize === size
                      ? 'bg-blue-800 text-white border-blue-800'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  ].join(' ')}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ダークモード */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">ダークモード</p>
            <button
              onClick={() => handleDarkMode(!darkMode)}
              className={['relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
                darkMode ? 'bg-blue-800' : 'bg-gray-200'
              ].join(' ')}
              aria-label="ダークモード切り替え"
            >
              <span className={['absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                darkMode ? 'translate-x-5' : 'translate-x-0'
              ].join(' ')} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">※ダークモードは現在実験的な機能です</p>
        </div>
      </div>
    </div>
  );
}
