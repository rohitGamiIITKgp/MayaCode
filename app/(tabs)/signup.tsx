import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // TODO: Implement signup logic
    console.log('Signup:', { name, email, password, confirmPassword });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <ScrollView className="flex-1 px-6 pt-12">
        <View className="items-center mb-8">
          <Image 
            source={require('@/assets/logo.svg')} 
            className="w-24 h-24 mb-4"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
          <Text className="text-gray-500 mt-2">Join our coding community</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2">Full Name</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Email</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Password</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Confirm Password</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            className="bg-blue-600 p-4 rounded-xl mt-6"
            onPress={handleSignup}
          >
            <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4 mb-8">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/login" className="text-blue-600 font-semibold">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 