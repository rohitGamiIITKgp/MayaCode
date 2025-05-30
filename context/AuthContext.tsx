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
  isLoading: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  isAuthenticated: boolean;
  sessionId: string | null;
  checkAuthStatus: () => Promise<void>;
  sendOtp: (phone: string) => Promise<string | null>;
  verifyOtp: (userId: string, otp: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const router = useRouter();

  // Helper to sanitize phone number to +[country code][number]
  const sanitizePhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return '+91' + digits;
    }
    if (digits.length > 10 && digits.startsWith('91')) {
      return '+' + digits;
    }
    return phone;
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
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setSessionId(null);
      }
    } catch (error: any) {
      console.error("Error checking session:", error);
      setUser(null);
      setIsAuthenticated(false);
      setSessionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone: string): Promise<string | null> => {
    setIsSendingOtp(true);
    try {
      const sanitizedPhone = sanitizePhone(phone);
      console.log('Sending OTP to:', sanitizedPhone);

      const token = await account.createPhoneToken(
        ID.unique(),
        sanitizedPhone
      );
      console.log('Phone token created:', token);
      
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please enter the OTP sent to your phone.',
      });

      return token.userId;
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
      console.log(`Verifying OTP for userId: ${userId}`);
      
      // Delete all existing sessions
      try {
        const sessions = await account.listSessions();
        for (const session of sessions.sessions) {
          await account.deleteSession(session.$id);
        }
        console.log('Deleted existing sessions');
      } catch (error) {
        console.log('Error deleting sessions:', error);
      }
      
      // Create new session with the OTP
      await account.createSession(userId, otp);
      console.log('Session created successfully');

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
    setIsLoading(true);
    try {
      await account.deleteSession("current");
      setUser(null);
      setIsAuthenticated(false);
      setSessionId(null);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged out successfully',
      });

      router.replace('/login');
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
