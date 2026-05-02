import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: '必須項目が未入力です' }, { status: 400 });
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 管理者への通知
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'share.quest.official@gmail.com',
      subject: `【SHARE Quest】お問い合わせ：${name}`,
      text: `名前：${name}\nメールアドレス：${email}\n\n${message}`,
    });

    // 送信者への自動返信
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '【SHARE Quest】お問い合わせを受け付けました',
      text: `${name} 様\n\nお問い合わせありがとうございます。\n以下の内容で受け付けました。\n\n---\n${message}\n---\n\n内容を確認のうえ、担当者よりご連絡いたします。\n\nSHARE Quest`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '送信に失敗しました' }, { status: 500 });
  }
}
