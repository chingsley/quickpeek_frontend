import AuthLandingHeroArt from '@/components/auth/AuthLandingHeroArt';
import CustomButton from '@/components/shared/CustomButton';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { images } from '@/constants/images';
import { SCREEN_CHROME_HORIZONTAL_PADDING } from '@/constants/layout';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { OAuthProvider } from '@/services/auth.services';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const WORDMARK_TEXT_SIZE = fonts.FONT_SIZE_SCREEN_TITLE;
/** Tall “Q” cap height — sits above the rest of the word on a shared baseline. */
const WORDMARK_LOGO_BADGE_SIZE = 52;

const SOCIAL_PROVIDERS: { id: OAuthProvider; icon: keyof typeof Ionicons.glyphMap; label: string; }[] = [
  { id: 'google', icon: 'logo-google', label: 'Google' },
  { id: 'apple', icon: 'logo-apple', label: 'Apple' },
  { id: 'facebook', icon: 'logo-facebook', label: 'Facebook' },
];

const AuthLandingScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signInWith, activeProvider, actionSheet } = useSocialAuth();

  const handleSocialPress = (provider: OAuthProvider) => {
    void signInWith(provider);
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
              <Text style={styles.appName}>uickpeek</Text>
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
          disabled={activeProvider !== null}
        />

        <Text style={styles.separator}>or sign in with</Text>

        <View style={styles.socialRow}>
          {SOCIAL_PROVIDERS.map((provider) => {
            const isActive = activeProvider === provider.id;
            return (
              <TouchableOpacity
                key={provider.id}
                style={[styles.socialButton, isActive && styles.socialButtonActive]}
                onPress={() => handleSocialPress(provider.id)}
                disabled={activeProvider !== null}
                accessibilityRole="button"
                accessibilityLabel={`Sign in with ${provider.label}`}
                accessibilityState={isActive ? { busy: true } : undefined}
              >
                {isActive ? (
                  <ActivityIndicator size="small" color={colors.PRIMARY} />
                ) : (
                  <Ionicons name={provider.icon} size={22} color={colors.PRIMARY} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/signup')}
          style={styles.signupRow}
          accessibilityRole="button"
          disabled={activeProvider !== null}
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
    fontSize: 35,
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
  socialButtonActive: {
    opacity: 0.6,
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
