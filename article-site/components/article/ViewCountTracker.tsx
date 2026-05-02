'use client';

import { useEffect } from 'react';

export function ViewCountTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    fetch(`/api/articles/${articleId}/view`, { method: 'POST' });
  }, [articleId]);

  return null;
}
