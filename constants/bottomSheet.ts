/** Backdrop fade duration when opening/closing bottom sheets. */
export const BOTTOM_SHEET_BACKDROP_DURATION_MS = 240;
/** Sheet slide duration when opening. */
export const BOTTOM_SHEET_OPEN_DURATION_MS = 360;
/** Sheet slide duration when closing (slightly faster). */
export const BOTTOM_SHEET_CLOSE_DURATION_MS = 300;
/**
 * Brief wait after a sibling RN Modal dismisses before opening a bottom sheet.
 * Android needs extra time for the native modal layer to release.
 */
export const OVERLAY_DISMISS_HANDOFF_MS = 50;
/**
 * Minimum wait after starting a BottomSheet close before opening another Modal.
 * Matches {@link BOTTOM_SHEET_CLOSE_DURATION_MS} (sheet slide) plus a small buffer.
 */
export const BOTTOM_SHEET_DISMISS_HANDOFF_MS =
  BOTTOM_SHEET_CLOSE_DURATION_MS + OVERLAY_DISMISS_HANDOFF_MS;
