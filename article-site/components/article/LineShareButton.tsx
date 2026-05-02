'use client';
import { useEffect, useState } from 'react';
type Props = { title: string };
export function LineShareButton({ title }: Props) {
  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    const url = window.location.href;
    setShareUrl(`https://line.me/R/msg/text/?${encodeURIComponent(title + '\n' + url)}`);
  }, [title]);
  return (
    <a
      href={shareUrl || '#'}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex items-center gap-2 px-4 py-2 bg-[#06C755] text-white text-sm font-medium rounded-full hover:bg-[#05a847] transition-colors'
    >
      <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.07 9.436-6.975C23.176 14.393 24 12.458 24 10.314' />
      </svg>
      LINE
    </a>
  );
}
