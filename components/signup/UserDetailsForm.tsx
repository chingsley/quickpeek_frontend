import CustomButton from '@/components/shared/CustomButton';
import FormField from '@/components/shared/FormField';
import { authScreenStyles } from '@/constants/authScreen';
import { UserDetailsFormProps } from '@/types/signup.types';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FieldKey = 'name' | 'username' | 'email' | 'password' | 'confirmPassword';

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}) => {
  const router = useRouter();
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const fieldErrors = useMemo(() => {
    const errors: Partial<Record<FieldKey, string>> = {};
    if (!formData.name.trim()) errors.name = 'Enter your name.';
    if (!formData.username.trim()) errors.username = 'Choose a username.';
    if (!formData.email.trim()) errors.email = 'Enter your email.';
    if (!formData.password) errors.password = 'Enter a password.';
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirm your password.';
    else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'The two passwords do not match.';
    }
    return errors;
  }, [formData]);

  const fieldError = (key: FieldKey) => (showFieldErrors ? fieldErrors[key] ?? null : null);

  const handleSubmit = () => {
    if (Object.keys(fieldErrors).length > 0) {
      setShowFieldErrors(true);
      return;
    }
    onSubmit();
  };

  return (
    <View style={styles.form}>
      <FormField
        label="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Name"
        error={fieldError('name')}
        testID="signup-name-input"
      />
      <FormField
        label="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        placeholder="Username"
        autoCapitalize="none"
        error={fieldError('username')}
        testID="signup-username-input"
      />
      <FormField
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={fieldError('email')}
        testID="signup-email-input"
      />
      <FormField
        label="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        placeholder="Password"
        secureTextEntry
        error={fieldError('password')}
        testID="signup-password-input"
      />
      <FormField
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        placeholder="Confirm Password"
        secureTextEntry
        error={fieldError('confirmPassword')}
        testID="signup-confirm-password-input"
      />
      <CustomButton
        text={isLoading ? 'Signing Up...' : 'Sign Up'}
        onPress={handleSubmit}
        disabled={isLoading}
        loading={isLoading}
      />
      <TouchableOpacity onPress={() => router.replace('/(auth)/signin')}>
        <Text style={authScreenStyles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserDetailsForm;

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
});
