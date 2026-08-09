import AuthFormScreenHeader from '@/components/auth/AuthFormScreenHeader';
import AuthScreenArt from '@/components/auth/AuthScreenArt';
import { authScreenStyles } from '@/constants/authScreen';
import { colors } from '@/constants/colors';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  children: React.ReactNode;
};

const AuthFormScreenLayout = ({ title, children }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <AuthScreenArt variant="onWhite" />
      <SafeAreaView style={[authScreenStyles.safeArea, styles.content]} edges={['top', 'left', 'right']}>
        <AuthFormScreenHeader title={title} />
        <KeyboardAvoidingView behavior="padding" style={styles.formArea}>
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={[
              authScreenStyles.scrollContainer,
              { paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
          >
            <View style={authScreenStyles.formCenter}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

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
  formArea: {
    flex: 1,
  },
  formScroll: {
    flex: 1,
  },
});
