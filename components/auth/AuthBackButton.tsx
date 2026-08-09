import { colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  onPress?: () => void;
};

const AuthBackButton = ({ onPress }: Props) => {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        onPress={onPress ?? (() => router.replace('/(auth)'))}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={24} color={colors.TEXT_DARK} />
      </TouchableOpacity>
    </View>
  );
};

export default AuthBackButton;

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  button: {
    padding: 4,
  },
});
