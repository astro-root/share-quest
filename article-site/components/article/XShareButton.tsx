'use client';
import { useEffect, useState } from 'react';
type Props = {
  title: string;
  url: string;
};
export function XShareButton({ title, url }: Props) {
  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    const finalUrl = url || window.location.href;
    setShareUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(finalUrl)}`);
  }, [title, url]);
  return (
    <a
      href={shareUrl || '#'}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-gray-900 text-white text-sm font-medium rounded-full border border-black dark:border-gray-600 hover:bg-gray-800 transition-colors'
    >
      <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
      </svg>
      Xでシェア
    </a>
  );
}
