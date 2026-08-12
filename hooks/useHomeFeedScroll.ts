import { TFeedQuestion } from '@/types/question.types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { TextInput } from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useComposedEventHandler,
} from 'react-native-reanimated';

type UseHomeFeedScrollParams = {
  feedListRef: React.RefObject<Animated.FlatList<TFeedQuestion> | null>;
  searchInputRef: React.RefObject<TextInput | null>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  shouldRestoreFeedScrollRef: React.MutableRefObject<boolean>;
  refreshAll: () => Promise<void>;
  isSearchActive: boolean;
  searching: boolean;
};

export const useHomeFeedScroll = ({
  feedListRef,
  searchInputRef,
  scrollHandler,
  shouldRestoreFeedScrollRef,
  refreshAll,
  isSearchActive,
  searching,
}: UseHomeFeedScrollParams) => {
  const feedScrollOffsetRef = useRef(0);

  const dismissSearchFocus = useCallback(() => {
    if (!isSearchActive || searching) return;
    searchInputRef.current?.blur();
    KeyboardController.dismiss();
  }, [isSearchActive, searching, searchInputRef]);

  const searchDismissScrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      runOnJS(dismissSearchFocus)();
    },
  });

  const persistFeedScrollOffset = useCallback((offset: number) => {
    feedScrollOffsetRef.current = offset;
  }, []);

  const trackFeedScrollOffsetHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      runOnJS(persistFeedScrollOffset)(event.contentOffset.y);
    },
  });

  const feedScrollHandler = useComposedEventHandler([
    scrollHandler,
    searchDismissScrollHandler,
    trackFeedScrollOffsetHandler,
  ]);

  const restoreFeedScrollOffset = useCallback(() => {
    const listRef = feedListRef.current;
    if (!listRef) return;
    listRef.scrollToOffset({ offset: feedScrollOffsetRef.current, animated: false });
  }, [feedListRef]);

  const restoreFeedScrollOffsetRef = useRef(restoreFeedScrollOffset);
  restoreFeedScrollOffsetRef.current = restoreFeedScrollOffset;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const run = async () => {
        const shouldRestore = shouldRestoreFeedScrollRef.current;
        await refreshAll();
        if (cancelled || !shouldRestore) return;

        shouldRestoreFeedScrollRef.current = false;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!cancelled) {
              restoreFeedScrollOffsetRef.current();
            }
          });
        });
      };

      void run();

      return () => {
        cancelled = true;
      };
    }, [refreshAll, shouldRestoreFeedScrollRef]),
  );

  return { feedScrollHandler };
};
