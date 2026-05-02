import { RichTextViewer } from '@/components/article/RichTextViewer';

interface Props { content: string }

export function ArticleContent({ content }: Props) {
  // HTMLタグが含まれていればリッチテキスト、なければプレーンテキストとして扱う
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return <RichTextViewer html={content} />;
  }

  return (
    <div className="prose prose-gray max-w-none">
      {content.split('\n').map((line, i) =>
        line === '' ? <br key={i} /> : <p key={i} className="text-gray-700 leading-relaxed">{line}</p>
      )}
    </div>
  );
}
