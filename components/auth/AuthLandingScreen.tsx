import CustomButton from '@/components/shared/CustomButton';
import { useActionSheet } from '@/components/shared/useActionSheet';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { images } from '@/constants/images';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type SocialProvider = 'google' | 'apple' | 'facebook';

const SOCIAL_PROVIDERS: { id: SocialProvider; icon: keyof typeof Ionicons.glyphMap; label: string; }[] = [
  { id: 'google', icon: 'logo-google', label: 'Google' },
  { id: 'apple', icon: 'logo-apple', label: 'Apple' },
  { id: 'facebook', icon: 'logo-facebook', label: 'Facebook' },
];

const AuthLandingScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showActionSheet, actionSheet } = useActionSheet();

  const handleSocialPress = (provider: string) => {
    showActionSheet({
      title: `${provider} sign-in coming soon`,
      message: 'Use email to sign in or create an account for now.',
      tone: 'info',
    });
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={images.hero3} style={styles.hero} resizeMode="cover">
        <View style={styles.heroOverlay} />
        <SafeAreaView style={styles.heroContent} edges={['top']}>
          <View style={styles.branding}>
            <Image source={images.logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>QuickPeek</Text>
            {/* <Text style={styles.tagline}>
              Ask questions from people <Text style={styles.taglineHighlight}>nearby</Text>.
            </Text>
            <Text style={styles.tagline}>
              Get answers from <Text style={styles.taglineHighlight}>real people</Text>.
            </Text> */}
          </View>
        </SafeAreaView>
      </ImageBackground>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <CustomButton
          text="Sign in with email"
          onPress={() => router.push('/(auth)/signin')}
          fullWidth
          noTopMargin
        />

        <Text style={styles.separator}>or sign in with</Text>

        <View style={styles.socialRow}>
          {SOCIAL_PROVIDERS.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={styles.socialButton}
              onPress={() => handleSocialPress(provider.label)}
              accessibilityRole="button"
              accessibilityLabel={`Sign in with ${provider.label}`}
            >
              <Ionicons name={provider.icon} size={22} color={colors.PRIMARY} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/signup')}
          style={styles.signupRow}
          accessibilityRole="button"
        >
          <Text style={styles.signupPrompt}>
            Don&apos;t have an account? <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {actionSheet}
    </View>
  );
};

export default AuthLandingScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BG_WHITE,
  },
  hero: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 46,
  },
  branding: {
    alignItems: 'center',
    maxWidth: 320,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 14,
  },
  appName: {
    fontFamily: fonts.FONT_FAMILY_BOLD,
    fontSize: fonts.FONT_SIZE_SCREEN_TITLE,
    color: colors.PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
    // textShadowColor: 'rgba(0, 0, 0, 0.35)',
    // textShadowOffset: { width: 0, height: 1 },
    // textShadowRadius: 6,
  },
  tagline: {
    fontFamily: fonts.FONT_FAMILY_REGULAR,
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.DARK_GRAY,
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  taglineHighlight: {
    fontFamily: fonts.FONT_FAMILY_BOLD,
    color: colors.SECONDARY,
  },
  sheet: {
    backgroundColor: colors.BG_WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    marginTop: -24,
    shadowColor: colors.BG_BLACK,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  separator: {
    fontFamily: fonts.FONT_FAMILY_REGULAR,
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  signupPrompt: {
    fontFamily: fonts.FONT_FAMILY_REGULAR,
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
    textAlign: 'center',
  },
  signupLink: {
    fontFamily: fonts.FONT_FAMILY_BOLD,
    color: colors.PRIMARY,
  },
});
