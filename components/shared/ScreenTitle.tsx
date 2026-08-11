import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

type ScreenTitleProps = {
  title: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

/**
 * Page title for full-screen routes. Always wrap in `screenChromeStyles.titleRow`
 * (back-nav screens), `titleRowInset` (body already padded), or
 * `titleRowStandalone` (tab screens). Vertical gap from the back/action row is
 * `SCREEN_CHROME_BACK_TO_TITLE_GAP` — do not set marginTop on this component.
 */
export function ScreenTitle({ title, style, numberOfLines }: ScreenTitleProps) {
  return (
    <Text style={[styles.title, style]} numberOfLines={numberOfLines}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.FONT_FAMILY_BOLD,
    fontSize: fonts.FONT_SIZE_SCREEN_TITLE,
    color: colors.TEXT_DARK,
    // color: colors.PRIMARY,
  },
});
