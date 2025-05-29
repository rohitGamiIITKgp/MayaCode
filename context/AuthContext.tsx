import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Account, Client, ID } from 'react-native-appwrite';
import Toast from 'react-native-toast-message';

// Appwrite Configuration
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)

export const account = new Account(client);

// Define types
export interface User {
  $id: string; // Appwrite user ID
  $createdAt: string; // Add createdAt
  $updatedAt: string; // Add updatedAt
  name: string; // Assuming name is stored in Appwrite user document
  phone: string; // Assuming phone is stored in Appwrite user document
  email?: string; // Email might be null for phone users
  photoURL?: string; // Assuming photoURL is stored if needed (will be in custom profile)
  // Add other Appwrite user properties based on account.get() output
  status: boolean;
  phoneVerification: boolean;
  emailVerification: boolean;
  prefs: { [key: string]: any };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; // Overall loading state
  isSendingOtp: boolean; // Loading state specifically for sending OTP
  isVerifyingOtp: boolean; // Loading state specifically for verifying OTP
  isAuthenticated: boolean;
  sessionId: string | null; // Appwrite session ID
  checkAuthStatus: () => Promise<void>;
  sendOtp: (phone: string) => Promise<string | null>; // Returns userId on success
  verifyOtp: (userId: string, otp: string) => Promise<boolean>; // Returns success status
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const router = useRouter();

  // Helper to sanitize phone number to +[country code][number]
  const sanitizePhone = (phone: string): string => {
     // Basic sanitization, may need more robust logic based on input format
    const digits = phone.replace(/D/g, '');
    // Assuming a default country code if none is provided and it looks like a local number
    if (digits.length === 10) { // Assuming 10 digit local number needs a country code
        return '+91' + digits; // Example for India
    }
    // If it already looks like it has a country code, just ensure it starts with +
    if (digits.length > 10 && digits.startsWith('91')) { // Example for India
        return '+' + digits;
    }
    return phone; // Return as is if format is unexpected
  };

  const checkAuthStatus = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Checking auth status...');
      const appwriteUser = await account.get();
      console.log('Appwrite user:', appwriteUser);
      
      if (appwriteUser) {
        setUser({
           $id: appwriteUser.$id,
           $createdAt: appwriteUser.$createdAt,
           $updatedAt: appwriteUser.$updatedAt,
           name: appwriteUser.name || 'User',
           phone: appwriteUser.phone || '',
           email: appwriteUser.email || undefined,
           status: appwriteUser.status,
           phoneVerification: appwriteUser.phoneVerification,
           emailVerification: appwriteUser.emailVerification,
           prefs: appwriteUser.prefs || {},
        });
        setIsAuthenticated(true);
        
        const sessions = await account.listSessions();
        const currentSession = sessions.sessions.find(session => session.current);
        if (currentSession) {
          setSessionId(currentSession.$id);
        } else {
          setSessionId(null);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setSessionId(null);
      }
    } catch (error: any) {
      console.error("Error checking session:", error);
      if (error.code === 401) {
        setUser(null);
        setIsAuthenticated(false);
        setSessionId(null);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Authentication Check Failed',
          text2: error.message || 'Could not check authentication status.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone: string): Promise<string | null> => {
    setIsSendingOtp(true);
    try {
      const sanitizedPhone = sanitizePhone(phone);
      console.log('Sending OTP to:', sanitizedPhone);

      // Check if a user with this phone number already exists in Appwrite
      // Appwrite does not have a direct way to check user existence by phone before creating token
      // You might need a backend function for this if you want to differentiate new/existing users upfront.
      // For now, we proceed to create a token, which might fail if user exists but not verified, or phone is invalid.

      const token = await account.createPhoneToken(
        ID.unique(), // Login ID - can be unique or user identifier (phone)
        sanitizedPhone
      );
      console.log('Phone token created:', token);
      
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please enter the OTP sent to your phone.',
      });

      return token.userId; // Return userId needed for session creation
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      Toast.show({
        type: 'error',
        text1: 'Failed to send OTP',
        text2: error.message || 'Please check your number and try again.',
      });
      return null;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (userId: string, otp: string): Promise<boolean> => {
    setIsVerifyingOtp(true);
    try {
      console.log(`Verifying OTP for userId: ${userId} with OTP: ${otp}`);
      
      // Delete current session first
      try {
        await account.deleteSession('current');
        console.log('Deleted current session');
      } catch (error) {
        console.log('No current session to delete or error deleting session:', error);
      }

      // Delete all other sessions
      try {
        const sessions = await account.listSessions();
        for (const session of sessions.sessions) {
          if (session.$id !== 'current') {
            await account.deleteSession(session.$id);
          }
        }
        console.log('Deleted other sessions');
      } catch (error) {
        console.log('Error deleting other sessions:', error);
      }
      
      // Create new session with the OTP
      const session = await account.createSession(userId, otp);
      console.log('Session created:', session);

      // Update auth status
      await checkAuthStatus();

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged in successfully',
      });

      router.replace('/(tabs)');
      return true;
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: error.message || 'Please check the OTP and try again.',
      });
      return false;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true); // Set overall loading during sign out
    try {
      console.log('Signing out...');
      await account.deleteSession("current");
      console.log('Session deleted.');

      setUser(null);
      setIsAuthenticated(false);
      setSessionId(null);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged out successfully',
      });

      router.replace('/login'); // Navigate back to login after sign out
    } catch (error: any) {
      console.error("Error logging out:", error);
      Toast.show({
        type: 'error',
        text1: 'Logout Error',
        text2: error.message || 'Failed to log out',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSendingOtp,
    isVerifyingOtp,
    isAuthenticated,
    sessionId,
    checkAuthStatus,
    sendOtp,
    verifyOtp,
    signOut
  };

  // Only show loading screen when explicitly loading auth status
  if (isLoading && isSendingOtp === false && isVerifyingOtp === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f5e9' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10, color: '#4a5568' }}>Loading authentication status...</Text>
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
