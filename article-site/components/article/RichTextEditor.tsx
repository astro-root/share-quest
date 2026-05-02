'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { useEffect, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const COLORS = [
  { label: '黒', value: '#111111' },
  { label: '赤', value: '#e53e3e' },
  { label: '橙', value: '#dd6b20' },
  { label: '黄', value: '#d69e2e' },
  { label: '緑', value: '#38a169' },
  { label: '青', value: '#3182ce' },
  { label: '紫', value: '#805ad5' },
  { label: '灰', value: '#718096' },
];

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      Youtube.configure({ width: 640, height: 360 }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[320px] px-4 py-3 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value === '') editor.commands.clearContent();
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href ?? '';
    const url = window.prompt('URLを入力', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('画像URLを入力');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('YouTube URLを入力');
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean, onClick: () => void, label: string, title?: string) => (
    <button type="button" title={title ?? label} onClick={onClick}
      className={[
        'px-2 py-1 rounded text-sm font-medium transition-colors',
        active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
      ].join(' ')}>
      {label}
    </button>
  );

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* ツールバー */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100 bg-gray-50">
        {/* 見出し */}
        {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 'H1')}
        {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2')}
        {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3')}
        <span className="w-px bg-gray-200 mx-1" />
        {/* 文字スタイル */}
        {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'B', '太字')}
        {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'I', '斜体')}
        {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'U', '下線')}
        {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), 'S̶', '取り消し線')}
        <span className="w-px bg-gray-200 mx-1" />
        {/* リスト */}
        {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '・リスト')}
        {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '1. リスト')}
        {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), '引用')}
        {btn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), 'Code')}
        <span className="w-px bg-gray-200 mx-1" />
        {/* リンク・メディア */}
        {btn(editor.isActive('link'), setLink, '🔗', 'リンク')}
        <button type="button" title="画像" onClick={addImage}
          className="px-2 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors">
          🖼
        </button>
        <button type="button" title="YouTube" onClick={addYoutube}
          className="px-2 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors">
          ▶
        </button>
        <span className="w-px bg-gray-200 mx-1" />
        {/* 文字色 */}
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button key={c.value} type="button" title={c.label}
              onClick={() => editor.chain().focus().setColor(c.value).run()}
              className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: c.value,
                borderColor: editor.isActive('textStyle', { color: c.value }) ? '#6366f1' : 'transparent'
              }} />
          ))}
          <button type="button" title="色をリセット"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="px-1.5 py-0.5 rounded text-xs text-gray-500 hover:bg-gray-100 border border-gray-200">
            reset
          </button>
        </div>
      </div>
      {/* エディタ本体 */}
      <EditorContent editor={editor} />
    </div>
  );
}
