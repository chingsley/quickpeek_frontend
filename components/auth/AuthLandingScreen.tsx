import AuthLandingHeroArt from '@/components/auth/AuthLandingHeroArt';
import CustomButton from '@/components/shared/CustomButton';
import { useActionSheet } from '@/components/shared/useActionSheet';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { images } from '@/constants/images';
import { SCREEN_CHROME_HORIZONTAL_PADDING } from '@/constants/layout';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type SocialProvider = 'google' | 'apple' | 'facebook';

const WORDMARK_TEXT_SIZE = fonts.FONT_SIZE_SCREEN_TITLE;
/** Tall “Q” cap height — sits above the rest of the word on a shared baseline. */
const WORDMARK_LOGO_BADGE_SIZE = 52;

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
      <View style={styles.hero}>
        <AuthLandingHeroArt />
        <SafeAreaView style={styles.heroContent} edges={['top']}>
          <View style={styles.branding} accessibilityRole="header" accessibilityLabel="QuickPeek">
            <View style={styles.wordmarkRow}>
              <View style={styles.logoBadge}>
                <Image source={images.logo} style={styles.logo} resizeMode="contain" accessibilityElementsHidden />
              </View>
              <Text style={styles.appName}>uickPeek</Text>
            </View>
          </View>

          <View style={styles.heroMessage}>
            <Text style={styles.headline}>Know before you go.</Text>
            <Text style={styles.subheadline}>
              Ask someone who&apos;s actually there—not reviews from last month.
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <CustomButton
          text="Sign in with email"
          onPress={() => router.push('/(auth)/signin')}
          variant="outline"
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
    backgroundColor: colors.PRIMARY,
    flex: 1,
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: SCREEN_CHROME_HORIZONTAL_PADDING + 8,
  },
  branding: {
    alignSelf: 'flex-start',
    paddingTop: 8,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  logoBadge: {
    borderRadius: '50%',
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    padding: 4,
  },
  logo: {
    width: WORDMARK_LOGO_BADGE_SIZE,
    height: WORDMARK_LOGO_BADGE_SIZE,
  },
  appName: {
    fontFamily: fonts.FONT_FAMILY_BOLD,
    fontSize: WORDMARK_TEXT_SIZE,
    color: colors.SECONDARY,
    lineHeight: WORDMARK_TEXT_SIZE,
    includeFontPadding: false,
    paddingBottom: 2,
  },
  heroMessage: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 52,
    maxWidth: 320,
  },
  headline: {
    fontFamily: fonts.FONT_FAMILY_EXTRABOLD,
    fontSize: 34,
    lineHeight: 40,
    color: colors.BG_WHITE,
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  subheadline: {
    fontFamily: fonts.FONT_FAMILY_REGULAR,
    fontSize: fonts.FONT_SIZE_SMALL,
    lineHeight: 24,
    color: colors.TEXT_ON_PRIMARY_MUTED,
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
