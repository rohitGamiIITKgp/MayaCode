import { ObjectId } from 'mongodb';

export type PostType = 'Offer Help' | 'Ask for Help' | 'Story';

export interface Post {
  _id?: ObjectId;
  phone: string;
  type: PostType;
  title: string;
  content: string;
  images?: string[];
  location?: string;
  tags?: string[];
  status: 'active' | 'completed' | 'archived';
  views: number;
  isUrgent?: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to create a new post
export const createPost = (
  phone: string,
  type: PostType,
  title: string,
  content: string,
  data: Partial<Post> = {}
): Post => {
  const now = new Date();
  return {
    phone,
    type,
    title,
    content,
    status: 'active',
    views: 0,
    createdAt: now,
    updatedAt: now,
    ...data
  };
};

// Helper function to update a post
export const updatePost = (post: Post, updates: Partial<Post>): Post => {
  return {
    ...post,
    ...updates,
    updatedAt: new Date()
  };
}; 