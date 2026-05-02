'use client';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
export function RichTextViewer({ html }: { html: string }) {
  const [clean, setClean] = useState('');
  useEffect(() => {
    setClean(DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p','br','strong','em','u','s','h1','h2','h3','h4',
        'ul','ol','li','blockquote','pre','code','a','img',
        'iframe','div','span',
      ],
      ALLOWED_ATTR: ['href','src','class','style','target','rel','allow','allowfullscreen','frameborder','width','height'],
    }));
  }, [html]);
  return (
    <div
      className="prose prose-gray max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 prose-strong:font-bold
        prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:pl-4 prose-blockquote:text-gray-500 prose-blockquote:italic
        prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:text-sm prose-code:text-indigo-700
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
        prose-img:rounded-xl prose-img:shadow-md
        prose-li:text-gray-700"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
