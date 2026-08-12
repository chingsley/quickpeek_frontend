import { CIRCULAR_CLICK_HEIGHT } from './layout';
import { fonts } from './fonts';

/** Top inset for menu/back row inside the pinned scroll-chrome toolbar. */
export const SCROLL_CHROME_PINNED_ACTION_ROW_MARGIN_TOP = 0;

/** Bottom inset inside a pinned scroll-chrome toolbar. */
export const SCROLL_CHROME_PINNED_TOOLBAR_PADDING_BOTTOM = 2;

/** Height of the pinned toolbar overlay (menu/back row) on Home and Chats. */
export const SCROLL_CHROME_PINNED_TOOLBAR_HEIGHT =
  SCROLL_CHROME_PINNED_ACTION_ROW_MARGIN_TOP +
  CIRCULAR_CLICK_HEIGHT +
  SCROLL_CHROME_PINNED_TOOLBAR_PADDING_BOTTOM;

/** Progress (0–1) at which scrolling header content opacity reaches zero. */
export const SCROLL_CHROME_FADE_OUT_END = 0.6;

/** Progress (0–1) at which header content slide is ~98% complete. */
export const SCROLL_CHROME_SLIDE_END = 0.85;

/** Compact nav-bar title when the large header title collapses (WhatsApp-style). */
export const SCROLL_CHROME_COLLAPSED_TITLE_FONT_SIZE = fonts.FONT_SIZE_XL2;

/** Scroll progress window where the compact toolbar title fades in. */
export const SCROLL_CHROME_COLLAPSED_TITLE_FADE_IN_START = 0.2;
export const SCROLL_CHROME_COLLAPSED_TITLE_FADE_IN_END = 0.65;

/** Extra upward travel for the large title during collapse. */
export const SCROLL_CHROME_LARGE_TITLE_EXTRA_TRANSLATE_Y = 18;
