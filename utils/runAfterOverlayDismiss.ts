import {
  BOTTOM_SHEET_DISMISS_HANDOFF_MS,
  OVERLAY_DISMISS_HANDOFF_MS,
} from '@/constants/bottomSheet';
import { Platform } from 'react-native';

/**
 * Run `action` after the current native Modal has unmounted.
 * Two rAFs let React commit the dismiss; then we wait for the bottom-sheet
 * close animation so a second Modal does not open on top of a dismissing one
 * (which leaves an invisible touch-blocking layer and freezes the app).
 */
export function runAfterOverlayDismiss(action: () => void): () => void {
  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const run = () => {
    if (cancelled) return;
    action();
  };

  const handoffMs =
    BOTTOM_SHEET_DISMISS_HANDOFF_MS +
    (Platform.OS === 'android' ? OVERLAY_DISMISS_HANDOFF_MS : 0);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (cancelled) return;
      timeoutId = setTimeout(run, handoffMs);
    });
  });

  return () => {
    cancelled = true;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  };
}
