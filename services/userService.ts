import { UserProfile } from '@/models/User';
import { account } from '@/context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';

// Helper function to get phone from session
const getPhoneFromSession = async (): Promise<string | null> => {
  try {
    const session = await account.getSession('current');
    if (!session) {
      console.error('No session found');
      return null;
    }

    const user = await account.get();
    const phone = user?.phone;

    if (!phone) {
      console.error('No phone number found in user details');
      return null;
    }

    return phone;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Simple GET request
const getRequest = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    return data as T;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  const responseData = await response.json();
  console.log('Response data:', responseData);
  return responseData as T;
};

// Simple POST request
const postRequest = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);
    return responseData as T;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

// Simple PUT request
const putRequest = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    console.log('✅ Response data:', responseData);
    return responseData as T;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

// Simple DELETE request
const deleteRequest = async (endpoint: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    console.log('✅ Delete successful');
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};

// Test API connectivity
export const testConnection = async (): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    console.log('🧪 Testing API connection...');
    const data = await getRequest<any>('/users');
    return { success: true, data };
  } catch (error) {
    console.error('Network error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// User Profile Operations
export const userService = {
  // Get all users
  getAllUsers: async (): Promise<UserProfile[] | null> => {
    try {
      console.log('👥 Fetching all users...');
      
      const url = 'http://localhost:8000/api/users/';
      console.log('🌐 Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Users data:', data);
      return data as UserProfile[];
    } catch (error) {
      console.error('getAllUsers error:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      return null;
    }
  },

  // Get user profile
  getUserProfile: async (): Promise<UserProfile | null> => {
    try {
      console.log('👤 Getting user profile...');
      
      const phone = await getPhoneFromSession();
      console.log('📱 Phone from session:', phone);
      
      if (!phone) {
        console.error('No phone number found in session');
        return null;
      }

      const response = await fetch(
        `${API_URL}/users/phone/${phone}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ User profile data:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('getUserProfile error:', error);
      throw error;
    }
  },

  // Create user profile
  createUserProfile: async (userData: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      console.log('👤 Creating user profile...');
      
      const phone = await getPhoneFromSession();
      if (!phone) {
        console.error('No phone number found in session');
        return null;
      }

      const profileData = {
        ...userData,
        phone,
        lastActive: new Date().toISOString()
      };

      return await postRequest<UserProfile>(`/users/phone/${phone}`, profileData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  },

  // Update user profile
  updateUserProfile: async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const phone = await getPhoneFromSession();
      if (!phone) {
        console.error('No phone number found in session');
        return null;
      }

      // Clean up updates by removing undefined values and empty arrays
      const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && !(Array.isArray(value) && value.length === 0)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Format updates to match backend expectations
      const formattedUpdates = {
        ...cleanedUpdates,
        lastActive: new Date().toISOString()
      };

      console.log('Update Profile Request:', {
        phone,
        updates,
        apiUrl: API_URL
      });

      const response = await fetch(
        `${API_URL}/users/phone/${phone}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedUpdates)
        }
      );

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      if (!response.ok) {
        console.error('Error response:', responseText);
        throw new Error(`Request failed with status ${response.status}: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ Parsed response data:', data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      return data as UserProfile;
    } catch (error) {
      console.error('updateUserProfile error:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name
        });
      }
      throw new Error('Failed to update user profile in database.');
    }
  },

  // Delete user profile
  deleteUserProfile: async (): Promise<boolean> => {
    try {
      const phone = await getPhoneFromSession();
      if (!phone) {
        console.error('No phone number found in session');
        return false;
      }

      await deleteRequest(`/users/phone/${phone}`);
      return true;
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return false;
    }
  },

  // Update user stats
  updateUserStats: async (stats: UserProfile['stats']): Promise<UserProfile | null> => {
    try {
      const phone = await getPhoneFromSession();
      if (!phone) {
        console.error('No phone number found in session');
        return null;
      }

      return await putRequest<UserProfile>(`/users/phone/${phone}/stats`, { stats });
    } catch (error) {
      console.error('Error updating user stats:', error);
      return null;
    }
  },

  // Add created post
  addCreatedPost: async (postId: string, postType: 'Offer Help' | 'Ask for Help' | 'Story'): Promise<UserProfile | null> => {
    try {
      const phone = await getPhoneFromSession();
      if (!phone) {
        console.error('No phone number found in session');
        return null;
      }

      return await postRequest<UserProfile>(`/users/phone/${phone}/posts`, { postId, postType });
    } catch (error) {
      console.error('Error adding created post:', error);
      return null;
    }
  }
};