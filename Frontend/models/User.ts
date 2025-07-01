import { ObjectId } from 'mongodb';

export type UserType = 'Refugee' | 'Helper' | 'Other';

export interface UserStats {
  storiesCount: number;
  helpPostsCount: number;
  askPostsCount: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  completedHelps: number;
  receivedHelps: number;
}

export interface UserProfile {
  _id?: string;
  phone: string;
  name: string;
  age?: number;
  location?: string;
  userType: UserType;
  languages: string[];
  profileImage?: string;
  
  // Content tracking
  createdStories: string[];
  createdHelpPosts: string[];
  createdAskPosts: string[];
  
  // Activity statistics
  stats: UserStats;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to create a new user profile
export const createUserProfile = (
  phone: string,
  data: Partial<Omit<UserProfile, '_id' | 'phone' | 'createdAt' | 'updatedAt' | 'stats'>> = {}
): UserProfile => {
  const now = new Date();
  return {
    phone,
    name: data.name || 'User',
    userType: data.userType || 'Refugee',
    languages: data.languages || [],
    createdAt: now,
    updatedAt: now,
    createdStories: [],
    createdHelpPosts: [],
    createdAskPosts: [],
    stats: {
      storiesCount: 0,
      helpPostsCount: 0,
      askPostsCount: 0,
      totalLikes: 0,
      totalComments: 0,
      totalViews: 0,
      completedHelps: 0,
      receivedHelps: 0
    },
    ...data
  };
};

// Helper function to update a user profile
export const updateUserProfile = (profile: UserProfile, updates: Partial<Omit<UserProfile, '_id' | 'phone'>>): UserProfile => {
  return {
    ...profile,
    ...updates,
    updatedAt: new Date()
  };
};