import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import type { Profile } from '@/lib/types';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'role'> | null = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, role')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f172a] dark:text-gray-100">
      <Header user={user} profile={profile} />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}
