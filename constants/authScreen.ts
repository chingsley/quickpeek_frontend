import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { SCREEN_CHROME_HORIZONTAL_PADDING } from '@/constants/layout';
import { StyleSheet } from 'react-native';

/** Shared layout and chrome for sign-in and sign-up screens. */
export const authScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.TRANSPARENT,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCenter: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: SCREEN_CHROME_HORIZONTAL_PADDING,
    alignSelf: 'center',
  },
  form: {
    width: '100%',
  },
  link: {
    marginTop: 20,
    fontFamily: fonts.FONT_FAMILY_REGULAR,
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
    textAlign: 'center',
  },
});
