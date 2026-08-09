import UserDetailsForm from '@/components/signup/UserDetailsForm';
import AuthBackButton from '@/components/auth/AuthBackButton';
import KeyboardAwareScreen from '@/components/shared/KeyboardAwareScreen';
import { useActionSheet } from '@/components/shared/useActionSheet';
import { authScreenStyles } from '@/constants/authScreen';
import { registerUser } from '@/services/auth.services';
import { SignupFormData } from '@/types/signup.types';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Signup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showActionSheet, actionSheet } = useActionSheet();
  const [formData, setFormData] = useState<SignupFormData>({
    name: 'New User',
    username: 'new_user',
    email: 'newuser@quickpeek.com',
    password: 'password123',
    confirmPassword: 'password123',
  });

  const handleSignup = async () => {
    const { name, email, username, password, confirmPassword } = formData;
    if (!name || !email || !password || !username || !confirmPassword) {
      showActionSheet({ title: 'Error', message: 'Missing required field', tone: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      showActionSheet({ title: 'Error', message: 'Passwords do not match', tone: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword: _, ...personalDetails } = formData;
      const response = await registerUser({
        ...personalDetails,
        deviceType: Platform.OS === 'web' ? 'web' : (Constants.platform?.ios ? 'ios' : 'android'),
        deviceToken: '',
        locationSharingEnabled: false,
      });

      if (response && response.data) {
        router.replace('/(auth)/signin');
      } else {
        showActionSheet({ title: 'Error', message: 'Invalid response from server', tone: 'error' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Signup failed';
      console.error('Signup error:', error, '\errorMessage: ', errorMessage);
      showActionSheet({ title: 'Error', message: errorMessage, tone: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={authScreenStyles.safeArea}>
      <KeyboardAwareScreen contentContainerStyle={authScreenStyles.scrollContainer}>
        <View style={authScreenStyles.container}>
          <AuthBackButton />
          <Text style={authScreenStyles.title}>Sign Up</Text>
          <UserDetailsForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSignup}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAwareScreen>

      {actionSheet}
    </SafeAreaView>
  );
};

export default Signup;
