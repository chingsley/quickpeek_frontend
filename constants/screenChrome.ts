import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';
import {
  SCROLL_CHROME_COLLAPSED_TITLE_FONT_SIZE,
  SCROLL_CHROME_PINNED_ACTION_ROW_MARGIN_TOP,
  SCROLL_CHROME_PINNED_TOOLBAR_PADDING_BOTTOM,
} from './scrollChrome';
import {
  SCREEN_CHROME_ACTION_ROW_MARGIN_BOTTOM,
  SCREEN_CHROME_ACTION_ROW_MARGIN_TOP,
  SCREEN_CHROME_HORIZONTAL_PADDING,
  SCREEN_CHROME_TITLE_ROW_MARGIN_BOTTOM,
  SCREEN_CHROME_TITLE_ROW_MARGIN_TOP,
  SCREEN_CHROME_TITLE_TOP_WITHOUT_ACTION_ROW,
} from './layout';

/** Shared header chrome: action row (back/menu) + page title spacing. */
export const screenChromeStyles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_CHROME_HORIZONTAL_PADDING,
    marginTop: SCREEN_CHROME_ACTION_ROW_MARGIN_TOP,
    marginBottom: SCREEN_CHROME_ACTION_ROW_MARGIN_BOTTOM,
  },
  /** Action row without bottom margin (pinned toolbar, inline chat header). */
  actionRowInset: {
    paddingHorizontal: SCREEN_CHROME_HORIZONTAL_PADDING,
    marginTop: SCREEN_CHROME_ACTION_ROW_MARGIN_TOP,
  },
  /** Pinned scroll-chrome toolbar row (Home menu/chats, Chats back). */
  pinnedActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_CHROME_HORIZONTAL_PADDING,
    marginTop: SCROLL_CHROME_PINNED_ACTION_ROW_MARGIN_TOP,
    marginBottom: SCREEN_CHROME_ACTION_ROW_MARGIN_BOTTOM,
    paddingBottom: SCROLL_CHROME_PINNED_TOOLBAR_PADDING_BOTTOM,
  },
  titleRow: {
    paddingHorizontal: SCREEN_CHROME_HORIZONTAL_PADDING,
    marginTop: SCREEN_CHROME_TITLE_ROW_MARGIN_TOP,
    marginBottom: SCREEN_CHROME_TITLE_ROW_MARGIN_BOTTOM,
  },
  /** Title vertical rhythm when the parent already applies page horizontal padding. */
  titleRowInset: {
    marginTop: SCREEN_CHROME_TITLE_ROW_MARGIN_TOP,
    marginBottom: SCREEN_CHROME_TITLE_ROW_MARGIN_BOTTOM,
  },
  /** Tab / standalone screens with no action row — title aligns with Home/Chats. */
  titleRowStandalone: {
    paddingHorizontal: SCREEN_CHROME_HORIZONTAL_PADDING,
    marginTop: SCREEN_CHROME_TITLE_TOP_WITHOUT_ACTION_ROW,
    marginBottom: SCREEN_CHROME_TITLE_ROW_MARGIN_BOTTOM,
  },
  /** Helper line under `ScreenTitle` (Home category subtitle, Wallet, etc.). */
  screenSubtitle: {
    fontFamily: fonts.FONT_FAMILY_REGULAR,
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
    marginTop: 2,
  },
  /** Compact centered title in pinned scroll-chrome toolbars (Home, Chats). */
  collapsedScrollTitle: {
    fontFamily: fonts.FONT_FAMILY_BOLD,
    fontSize: SCROLL_CHROME_COLLAPSED_TITLE_FONT_SIZE,
    color: colors.TEXT_DARK,
    textAlign: 'center',
  },
});
