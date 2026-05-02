'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    const saved = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | null;
    if (saved) setFontSize(saved);
  }, []);

  const handleFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    const map = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = map[size];
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
        <Link href="/articles" className="text-gray-400 hover:text-blue-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-bold text-gray-900">設定</h1>
      </div>

      <div className="space-y-6">
        {/* ログイン */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">アカウント</p>
          <Link href="/login"
            className="inline-block rounded-lg bg-blue-800 text-white px-4 py-2 text-sm font-medium hover:bg-blue-900 transition-colors">
            ログイン / 新規登録
          </Link>
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
      </div>
    </div>
  );
}
