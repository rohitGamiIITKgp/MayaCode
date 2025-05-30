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
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+7', country: 'Russia' },
  { code: '+55', country: 'Brazil' },
  { code: '+61', country: 'Australia' },
  { code: '+82', country: 'South Korea' },
  { code: '+358', country: 'Finland' },
  { code: '+46', country: 'Sweden' },
  { code: '+380', country: 'Ukraine' },
  { code: '+47', country: 'Norway' },
  { code: '+351', country: 'Portugal' },
  { code: '+31', country: 'Netherlands' },
  { code: '+41', country: 'Switzerland' },
];

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [showDropdown, setShowDropdown] = useState(false);

  const { sendOtp, verifyOtp } = useAuth();
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
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const fullPhoneNumber = `${selectedCountryCode}${phone}`;
      console.log('Sending OTP to:', fullPhoneNumber);
      
      const userId = await sendOtp(fullPhoneNumber);
      if (userId) {
        setUserId(userId);
        setIsOtpSent(true);
      }
    } catch (error: any) {
      console.error('OTP Send Error:', error);
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
    if (isLoading) return;
    
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
      const success = await verifyOtp(userId, otp);
      if (success) {
        navigation.navigate('Home' as never);
      }
    } catch (error: any) {
      console.error('OTP Verification Error:', error);
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
                <View style={styles.dropdownButtonContent}>
                  <Text style={styles.dropdownButtonCode}>{selectedCountryCode}</Text>
                  <View style={styles.buttonVerticalSeparator} />
                  <Text style={styles.dropdownButtonCountry}>
                    {countryCodes.find(item => item.code === selectedCountryCode)?.country || 'Select Country'}
                  </Text>
                </View>
                <FontAwesome 
                  name={showDropdown ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#4b5563" 
                />
              </TouchableOpacity>
            </View>

            {showDropdown && (
              <View style={styles.dropdownOverlay}>
                <ScrollView 
                  style={styles.dropdownScrollContainer}
                  contentContainerStyle={styles.dropdownScrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                  scrollEnabled={true}
                >
                  {countryCodes.map((item, index) => (
                    <TouchableOpacity
                      key={`${item.code}-${index}`}
                      style={[
                        styles.dropdownItem,
                        index === countryCodes.length - 1 && styles.dropdownItemLast
                      ]}
                      onPress={() => {
                        setSelectedCountryCode(item.code);
                        setShowDropdown(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dropdownItemContent}>
                        <Text style={styles.dropdownItemCode}>{item.code}</Text>
                        <View style={styles.verticalSeparator} />
                        <Text style={styles.dropdownItemCountry}>{item.country}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TextInput
              style={styles.phoneInput}
              placeholder="Enter your phone number"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSendOtp} 
              disabled={isLoading}
            >
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

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleVerifyOtp} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleSendOtp} 
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
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButtonCode: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  buttonVerticalSeparator: {
    width: 1,
    height: 20,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
  },
  dropdownButtonCountry: {
    fontSize: 16,
    color: '#6b7280',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 120,
    left: 28,
    right: 28,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    maxHeight: 300,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownScrollContainer: {
    maxHeight: 300,
  },
  dropdownScrollContent: {
    flexGrow: 1,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dropdownItemCode: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    minWidth: 50,
  },
  verticalSeparator: {
    width: 1,
    height: 20,
    backgroundColor: '#d1d5db',
    marginHorizontal: 6,
  },
  dropdownItemCountry: {
    fontSize: 16,
    color: '#6b7280',
    flex: 1,
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