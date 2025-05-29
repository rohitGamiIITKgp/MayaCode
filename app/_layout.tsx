import './globals.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#6fcf6f' }}>
      <StatusBar hidden={true} />
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </AuthProvider>
    </View>
  );
}
