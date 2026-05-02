import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 同じセッション内で同じ記事を重複カウントしない
  const cookieStore = await cookies();
  const key = `viewed_${id}`;
  if (cookieStore.get(key)) {
    return NextResponse.json({ skipped: true });
  }

  const supabase = await createClient();
  await supabase.rpc('increment_view_count', { article_id: id });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(key, '1', { maxAge: 60 * 30, httpOnly: true, path: '/' }); // 30分
  return response;
}
