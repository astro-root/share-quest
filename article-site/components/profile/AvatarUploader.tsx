'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type Props = {
  userId: string;
  currentAvatarUrl: string | null;
  onUpload: (url: string) => void;
};

export function AvatarUploader({ userId, currentAvatarUrl, onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      setPreview(url);
      onUpload(data.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image src={preview} alt="アバター" width={64} height={64} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-400 text-xs text-center">画像<br/>選択</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-sm text-indigo-600 hover:underline"
        disabled={uploading}
      >
        {uploading ? 'アップロード中...' : '画像を変更'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
