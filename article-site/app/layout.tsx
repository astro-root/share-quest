import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | SHARE Quest',
    default: 'SHARE Quest',
  },
  description: '学びの「楽しい！」をつなげる記事メディア',
  openGraph: {
    title: 'SHARE Quest',
    description: '学びの「楽しい！」をつなげる記事メディア',
    url: 'https://share-quest.astro-root.com',
    siteName: 'SHARE Quest',
    images: [{ url: 'https://share-quest.astro-root.com/og-image.png', width: 1200, height: 630 }],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHARE Quest',
    description: '学びの「楽しい！」をつなげる記事メディア',
    images: ['https://share-quest.astro-root.com/og-image.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.getItem('darkMode') === 'true') {
              document.documentElement.classList.add('dark');
            }
          } catch(e) {}
        ` }} />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased dark:bg-[#0f172a] dark:text-gray-100">{children}</body>
    </html>
  );
}