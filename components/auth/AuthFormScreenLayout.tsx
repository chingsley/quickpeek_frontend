import AuthFormScreenHeader from '@/components/auth/AuthFormScreenHeader';
import AuthScreenArt from '@/components/auth/AuthScreenArt';
import KeyboardAwareScreen from '@/components/shared/KeyboardAwareScreen';
import { authScreenStyles } from '@/constants/authScreen';
import { colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title: string;
  children: React.ReactNode;
};

const AuthFormScreenLayout = ({ title, children }: Props) => (
  <View style={styles.root}>
    <AuthScreenArt variant="onWhite" />
    <SafeAreaView style={[authScreenStyles.safeArea, styles.content]} edges={['top', 'left', 'right']}>
      <AuthFormScreenHeader title={title} />
      <KeyboardAwareScreen
        style={styles.formScroll}
        contentContainerStyle={authScreenStyles.scrollContainer}
      >
        <View style={authScreenStyles.formCenter}>{children}</View>
      </KeyboardAwareScreen>
    </SafeAreaView>
  </View>
);

export default AuthFormScreenLayout;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BG_WHITE,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  formScroll: {
    flex: 1,
  },
});
