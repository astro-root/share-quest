'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

interface Props { initialTab: 'login' | 'signup' }

export function TabSwitcher({ initialTab }: Props) {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);

  return (
    <div>
      <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
        <button
          onClick={() => setTab('login')}
          className={['flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
            tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'].join(' ')}
        >
          ログイン
        </button>
        <button
          onClick={() => setTab('signup')}
          className={['flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
            tab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'].join(' ')}
        >
          新規登録
        </button>
      </div>
      {tab === 'login' ? <LoginForm /> : <SignUpForm />}
    </div>
  );
}
