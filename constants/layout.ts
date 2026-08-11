/** Header avatar size (chat header counterparty photo, etc.). */
export const CHAT_AVATAR_SIZE = 40;

/** Circular toolbar controls (back button, overflow menu, etc.). */
export const CIRCULAR_CLICK_WIDTH = 40;
export const CIRCULAR_CLICK_HEIGHT = 40;

/** Corner radius for bordered fields (location rows, multiline inputs, cards). */
export const BORDER_RADIUS_INPUT = 14;

/** Corner radius for floating overflow / context menus. */
export const BORDER_RADIUS_MENU = 16;

/** Corner radius for primary buttons and selected interactive rows (e.g. Ask a Question). */
export const BORDER_RADIUS_BUTTON = 24;

/** Pill radius for single-line inputs and primary buttons. */
export const BORDER_RADIUS_PILL = 100;

/**
 * Shared vertical rhythm for Home + Chats screen headers.
 * Gap from the action row (menu/back) to the page title is
 * {@link SCREEN_CHROME_BACK_TO_TITLE_GAP} (canonical: Ask a question).
 */
export const SCREEN_CHROME_HORIZONTAL_PADDING = 16;
export const SCREEN_CHROME_ACTION_ROW_MARGIN_TOP = 8;
/** Canonical vertical gap from the back/action row to the page title. */
export const SCREEN_CHROME_BACK_TO_TITLE_GAP = 12;
export const SCREEN_CHROME_ACTION_ROW_MARGIN_BOTTOM = 0;
export const SCREEN_CHROME_TITLE_ROW_MARGIN_TOP = SCREEN_CHROME_BACK_TO_TITLE_GAP;
export const SCREEN_CHROME_TITLE_ROW_MARGIN_BOTTOM = 20;
/** Y offset to the bottom edge of the back/menu control in the action row. */
export const SCREEN_CHROME_ACTION_ROW_CONTENT_BOTTOM =
  SCREEN_CHROME_ACTION_ROW_MARGIN_TOP + CIRCULAR_CLICK_HEIGHT;
/** Page title top offset on screens without an action row (matches Home/Chats title Y). */
export const SCREEN_CHROME_TITLE_TOP_WITHOUT_ACTION_ROW =
  SCREEN_CHROME_ACTION_ROW_CONTENT_BOTTOM + SCREEN_CHROME_BACK_TO_TITLE_GAP;
/** Question-detail meta row spacing below the page title. */
export const SCREEN_CHROME_DETAIL_META_MARGIN_BOTTOM = 16;
/** Question-detail status row spacing above the info banner. */
export const SCREEN_CHROME_DETAIL_STATUS_MARGIN_BOTTOM = 16;
