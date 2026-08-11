import { SCROLL_CHROME_PINNED_TOOLBAR_HEIGHT } from './scrollChrome';

export {
  SCROLL_CHROME_FADE_OUT_END as HOME_CHROME_FADE_OUT_END,
  SCROLL_CHROME_SLIDE_END as HOME_CHROME_SLIDE_END,
} from './scrollChrome';

/** Pinned toolbar height when the feed chrome is collapsed (menu + chats row). */
export const HOME_COLLAPSED_HEADER_HEIGHT = SCROLL_CHROME_PINNED_TOOLBAR_HEIGHT;

// NOTE: there is intentionally no fixed "collapse distance" constant. The
// distance scrolled to fully hide the chrome equals the measured header swing
// (expanded header height − HOME_COLLAPSED_HEADER_HEIGHT), so the header's
// bottom edge tracks the list content 1:1 and never outruns the first card.
// See useHomeScrollChrome.ts.

/** Collapsed FAB diameter. */
export const HOME_FAB_COLLAPSED_SIZE = 52;

/** Expanded FAB width (icon + label). */
export const HOME_FAB_EXPANDED_WIDTH = 190;

/** Max width for the FAB label when expanded (caps width during collapse animation). */
export const HOME_FAB_TEXT_MAX_WIDTH = 132;

/** Gap between the FAB icon and label when expanded. */
export const HOME_FAB_ICON_GAP = 6;

/** How close to the list end counts as "at bottom" for chrome locking. */
export const HOME_SCROLL_BOTTOM_LOCK_THRESHOLD = 8;
