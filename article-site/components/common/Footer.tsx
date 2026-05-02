import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © 2026 SHARE Quest Dev.
        </p>
        <nav className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">お問い合わせ</Link>
          <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">利用規約</Link>
        </nav>
      </div>
    </footer>
  );
}
