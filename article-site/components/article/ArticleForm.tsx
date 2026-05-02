'use client';

import { useActionState, useState } from 'react';
import { createArticle } from '@/actions/article';
import { createTag } from '@/actions/article';
import type { ArticleFormState } from '@/actions/article';
import { RichTextEditor } from '@/components/article/RichTextEditor';

interface Tag { id: string; name: string; slug: string }
interface Props { tags: Tag[] }

const initial: ArticleFormState = { errors: {}, success: false };

export function ArticleForm({ tags: initialTags }: Props) {
  const [state, action, pending] = useActionState(createArticle, initial);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [newTagName, setNewTagName] = useState('');
  const [addingTag, setAddingTag] = useState(false);

  const toggleTag = (id: string) =>
    setSelectedTags((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  const handleAddTag = async () => {
    const name = newTagName.trim();
    if (!name) return;
    setAddingTag(true);
    const tag = await createTag(name);
    if (tag) {
      setTags((prev) => [...prev, tag]);
      setSelectedTags((prev) => [...prev, tag.id]);
      setNewTagName('');
    }
    setAddingTag(false);
  };

  return (
    <form action={action} className="space-y-6">
      {state.errors?._general && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.errors._general[0]}
        </p>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input name="title" type="text" required maxLength={200}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="記事のタイトルを入力" />
        {state.errors?.title && <p className="text-xs text-red-500 mt-1">{state.errors.title[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">抜粋（任意）</label>
        <textarea name="excerpt" rows={2} maxLength={300}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm resize-none focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="記事の概要（一覧に表示されます）" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          本文 <span className="text-red-500">*</span>
        </label>
        <input type="hidden" name="content" value={content} />
        <RichTextEditor value={content} onChange={setContent} />
        {state.errors?.content && <p className="text-xs text-red-500 mt-1">{state.errors.content[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">カバー画像（任意）</label>
        <input name="coverImage" type="file" accept="image/jpeg,image/png,image/webp"
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {state.errors?.coverImage && <p className="text-xs text-red-500 mt-1">{state.errors.coverImage[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">タグ</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => {
            const selected = selectedTags.includes(tag.id);
            return (
              <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                className={['px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  selected ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'].join(' ')}>
                #{tag.name}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
            placeholder="新しいタグを追加..."
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button type="button" onClick={handleAddTag} disabled={addingTag || !newTagName.trim()}
            className="rounded-lg bg-blue-700 text-white px-3 py-1.5 text-xs font-medium hover:bg-blue-800 disabled:opacity-40 transition-colors">
            {addingTag ? '追加中...' : '追加'}
          </button>
        </div>
        {selectedTags.map((id) => (
          <input key={id} type="hidden" name="tagIds" value={id} />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" name="status" value="draft" disabled={pending}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
          下書き保存
        </button>
        <button type="submit" name="status" value="pending" disabled={pending}
          className="flex-2 rounded-xl bg-blue-700 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors">
          {pending ? '送信中...' : '投稿申請する'}
        </button>
      </div>
    </form>
  );
}
