import { account, useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ID } from 'appwrite';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

// Country codes data
const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+358', country: 'Suomi' },
  { code: '+46', country: 'Svenska' },
  { code: '+380', country: 'Українська мова' },
  { code: '+47', country: 'Norsk' },
  { code: '+49', country: 'Deutsch' },
  { code: '+34', country: 'Español' },
  { code: '+351', country: 'Português' },
];

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [showDropdown, setShowDropdown] = useState(false);

  const { checkAuthStatus } = useAuth();
  const navigation = useNavigation();

  // Validate phone number: must be 10 digits
  const isValidPhone = (phone: string) => {
    const sanitized = phone.replace(/\D/g, '');
    return sanitized.length === 10;
  };

  const handleSendOtp = async () => {
    if (!isValidPhone(phone)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Number',
        text2: 'Please enter a valid 10-digit phone number.',
      });
      return;
    }
    
    if (isLoading) {
      return; // Prevent multiple simultaneous requests
    }
    
    setIsLoading(true);
    try {
      const fullPhoneNumber = `${selectedCountryCode}${phone}`;
      console.log('Sending OTP to:', fullPhoneNumber); // Debug log
      
      const token = await account.createPhoneToken(ID.unique(), fullPhoneNumber);
      setUserId(token.userId);
      setIsOtpSent(true);

      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please enter the OTP sent to your phone.',
      });
    } catch (error: any) {
      console.error('OTP Send Error:', error.message);
      console.error('Full error:', error); // More detailed error logging
      Toast.show({
        type: 'error',
        text1: 'Failed to send OTP',
        text2: error.message || 'Please check your number and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (isLoading) {
      return; // Prevent multiple simultaneous requests
    }
    
    if (!otp || otp.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a valid OTP.',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const sessions = await account.listSessions();
      for (const session of sessions.sessions) {
        if (session.$id !== 'current') {
          await account.deleteSession(session.$id);
        }
      }
      console.log('Deleted other sessions');
      await account.createSession(userId, otp);
      await checkAuthStatus();
      navigation.navigate('Home' as never);
    } catch (error: any) {
      console.error('OTP Verification Error:', error.message);
      console.error('Full error:', error); // More detailed error logging
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: error.message || 'Please check the OTP and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.welcomeTitle}>Welcome to MayaCode</Text>
        <Text style={styles.subtitle}>Please enter your phone number to continue</Text>

        {!isOtpSent && (
          <>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownButtonText}>{selectedCountryCode}</Text>
                <FontAwesome 
                  name={showDropdown ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#4b5563" 
                />
              </TouchableOpacity>
              {showDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView 
                    style={styles.dropdownScroll} 
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                  >
                    {countryCodes.map((item) => (
                      <TouchableOpacity
                        key={item.code}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedCountryCode(item.code);
                          setShowDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item.code} {item.country}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <TextInput
              style={styles.phoneInput}
              placeholder="Enter your phone number"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />

            <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {isOtpSent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                if (!isLoading) {
                  handleSendOtp();
                }
              }} 
              disabled={isLoading}
            >
              <Text style={styles.link}>Resend OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 16,
    zIndex: 1000,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111827',
  },
  phoneInput: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: '#2563eb',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;