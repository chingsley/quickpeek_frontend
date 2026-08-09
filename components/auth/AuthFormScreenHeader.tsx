import BackButton from '@/components/shared/BackButton';
import { ScreenTitle } from '@/components/shared/ScreenTitle';
import { screenChromeStyles } from '@/constants/screenChrome';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

type Props = {
  title: string;
};

const AuthFormScreenHeader = ({ title }: Props) => {
  const router = useRouter();

  return (
    <>
      <View style={screenChromeStyles.actionRow}>
        <BackButton onPress={() => router.replace('/(auth)')} />
      </View>
      <View style={screenChromeStyles.titleRow}>
        <ScreenTitle title={title} />
      </View>
    </>
  );
};

export default AuthFormScreenHeader;
