import { createPost, Post, updatePost } from '@/models/Post';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Post Operations
export const postService = {
  // Create a new post
  async createPost(
    phone: string,
    type: Post['type'],
    title: string,
    content: string,
    data: Partial<Post> = {}
  ): Promise<Post | null> {
    try {
      const post = createPost(phone, type, title, content, data);
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },

  // Get a post by ID
  async getPost(postId: string): Promise<Post | null> {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  // Get posts by phone
  async getUserPosts(phone: string): Promise<Post[]> {
    try {
      const response = await fetch(`${API_URL}/posts/user/${phone}`);
      if (!response.ok) throw new Error('Failed to fetch user posts');
      return response.json();
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  },

  // Update a post
  async updatePost(postId: string, updates: Partial<Post>): Promise<Post | null> {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update post');
      return response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      return null;
    }
  },

  // Delete a post
  async deletePost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }
}; 