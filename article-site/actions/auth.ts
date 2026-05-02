'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signUp(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const display_name = (formData.get('display_name') as string)?.trim();

  if (!email || !password) return { error: 'メールアドレスとパスワードを入力してください' };
  if (password.length < 8) return { error: 'パスワードは8文字以上で入力してください' };

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  if (!data.user) return { error: '登録に失敗しました' };

  if (display_name) {
    await supabase.from('profiles').update({ display_name }).eq('id', data.user.id);
  }

  if (data.session) redirect('/articles');
  return { success: true };
}

export async function signIn(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'メールアドレスまたはパスワードが正しくありません' };

  redirect('/articles');
}
