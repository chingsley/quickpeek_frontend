import ActionSheet, { ActionSheetConfig } from '@/components/shared/ActionSheet';
import { runAfterOverlayDismiss } from '@/utils/runAfterOverlayDismiss';
import React, { useCallback, useRef, useState } from 'react';

/**
 * Holds the visible/config state for an ActionSheet so call sites read like
 * Alert.alert: `showActionSheet({ title, message, tone, buttons })` and
 * render `{actionSheet}` once near the screen root.
 *
 * Use `showActionSheetAfterDismiss` when another RN Modal (bottom sheet, menu,
 * etc.) is closing — opening a second modal immediately leaves an invisible
 * touch-blocking layer and freezes the app.
 */
export const useActionSheet = () => {
  const [config, setConfig] = useState<ActionSheetConfig | null>(null);
  const dismissCleanupRef = useRef<(() => void) | null>(null);

  const showActionSheet = useCallback((next: ActionSheetConfig) => setConfig(next), []);

  const showActionSheetAfterDismiss = useCallback((next: ActionSheetConfig) => {
    dismissCleanupRef.current?.();
    dismissCleanupRef.current = runAfterOverlayDismiss(() => setConfig(next));
  }, []);

  const hideActionSheet = useCallback(() => {
    dismissCleanupRef.current?.();
    dismissCleanupRef.current = null;
    setConfig(null);
  }, []);

  const actionSheet = (
    <ActionSheet
      visible={config !== null}
      onClose={hideActionSheet}
      title={config?.title ?? ''}
      message={config?.message}
      tone={config?.tone}
      buttons={config?.buttons}
    />
  );

  return { showActionSheet, showActionSheetAfterDismiss, hideActionSheet, actionSheet };
};
