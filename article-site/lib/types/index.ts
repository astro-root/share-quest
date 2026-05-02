export type UserRole = 'reader' | 'writer' | 'admin';
export type ArticleStatus = 'draft' | 'pending' | 'published';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_id: string;
  status: ArticleStatus;
  published_at: string | null;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithDetails extends Article {
  profiles: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'>;
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[];
  likes_count?: number;
  is_liked?: boolean;
  is_favorited?: boolean;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>;
}

export interface Like {
  id: string;
  article_id: string;
  user_id: string;
  created_at: string;
}
