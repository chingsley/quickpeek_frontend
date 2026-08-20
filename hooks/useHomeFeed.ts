import {
  CLOSED_QUESTIONS_CATEGORY_KEY,
  FEED_CATEGORY_DEFS,
} from '@/constants/feedCategories';
import { getMyClosedQuestions, getQuestionFeed, searchQuestions } from '@/services/questions.services';
import { getConversations } from '@/services/requests.services';
import SocketService from '@/services/socket.services';
import { useDrawerStore } from '@/store/drawer.store';
import { useLiveLocationStore } from '@/store/liveLocation.store';
import { selectIsLoggedIn, useAuthStore } from '@/store/auth.store';
import { TFeedCounts, TFeedQuestion } from '@/types/question.types';
import { filterDisplayedFeedItems, getHomeCategorySubtitle } from '@/utils/homeFeedDisplay';
import { resolveQuestionCardPress } from '@/utils/questionFeedAttention';
import { StatusTagKey } from '@/utils/questionStatus';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import Animated from 'react-native-reanimated';

export const useHomeFeed = (resetChrome: () => void) => {
  const router = useRouter();
  const setMenuCategories = useDrawerStore((state) => state.setMenuCategories);
  const selectedCategoryKey = useDrawerStore((state) => state.selectedCategoryKey);
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const authUserId = useAuthStore((state) => state.user?.id);
  const coords = useLiveLocationStore((s) => s.coords);
  const ensureLiveCoords = useLiveLocationStore((s) => s.promptForCoords);
  const refreshCoords = useLiveLocationStore((s) => s.refreshCoords);

  const feedListRef = useRef<Animated.FlatList<TFeedQuestion>>(null);
  const searchInputRef = useRef<TextInput>(null);
  const searchRequestIdRef = useRef(0);
  const shouldRestoreFeedScrollRef = useRef(false);
  const hasLoadedFeedRef = useRef(false);

  const [feedItems, setFeedItems] = useState<TFeedQuestion[]>([]);
  const [closedItems, setClosedItems] = useState<TFeedQuestion[]>([]);
  const [feedCounts, setFeedCounts] = useState<TFeedCounts>({ all: 0, incoming: 0, outgoing: 0, closed: 0 });
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [loading, setLoading] = useState(false);
  const [closedLoading, setClosedLoading] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<TFeedQuestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTags, setActiveTags] = useState<Set<StatusTagKey>>(new Set());

  const isSearchActive = search.trim().length > 0;
  const isClosedCategory = selectedCategoryKey === CLOSED_QUESTIONS_CATEGORY_KEY;
  const nearMe = activeTags.has('near_me');

  const loadUnreadCount = useCallback(async () => {
    try {
      const data = await getConversations();
      setUnreadChatCount(data.unreadTotal);
    } catch {
      setUnreadChatCount(0);
    }
  }, []);

  const loadFeed = useCallback(async (options?: { silent?: boolean }) => {
    if (!isLoggedIn) return;

    const silent = options?.silent ?? false;
    if (!silent) {
      setLoading(true);
    }

    try {
      const feedParams: Parameters<typeof getQuestionFeed>[0] = {};
      if (coords) {
        feedParams.lat = coords.lat;
        feedParams.lng = coords.lng;
      }
      if (nearMe) {
        feedParams.nearMe = true;
      }
      const data = await getQuestionFeed(feedParams);
      setFeedItems(data.items);
      setFeedCounts(data.counts);
      hasLoadedFeedRef.current = true;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Expected authenticated feed response'
      ) {
        // Stale JWT: optionalAuth treats invalid tokens as anonymous, so the feed
        // returns a public shape while persisted storage still looks logged-in.
        await useAuthStore.getState().logout();
        return;
      }
      console.error('Failed to load feed:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [coords, isLoggedIn, nearMe]);

  const loadClosedQuestions = useCallback(async () => {
    if (!isLoggedIn) return;

    setClosedLoading(true);
    try {
      const data = await getMyClosedQuestions();
      setClosedItems(data.items);
    } catch (error) {
      console.error('Failed to load closed questions:', error);
      setClosedItems([]);
    } finally {
      setClosedLoading(false);
    }
  }, [isLoggedIn]);

  const refreshAll = useCallback(async () => {
    if (!isLoggedIn) return;
    void loadUnreadCount();
    await Promise.all([
      loadFeed({ silent: hasLoadedFeedRef.current }),
      loadClosedQuestions(),
    ]);
  }, [isLoggedIn, loadClosedQuestions, loadFeed, loadUnreadCount]);

  useEffect(() => {
    if (!isLoggedIn) return;
    void refreshCoords();
  }, [isLoggedIn, refreshCoords]);

  useEffect(() => {
    const trimmed = search.trim();

    if (trimmed.length < 2) {
      setSearching(false);
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const requestId = ++searchRequestIdRef.current;
    const handle = setTimeout(async () => {
      try {
        const data = await searchQuestions(trimmed);
        if (requestId !== searchRequestIdRef.current) return;
        setSearchResults(data.items);
      } catch (error) {
        if (requestId !== searchRequestIdRef.current) return;
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        if (requestId === searchRequestIdRef.current) {
          setSearching(false);
        }
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const socket = SocketService.getSocket();
    if (!socket) return;

    socket.on('message:new', refreshAll);
    socket.on('request:new', refreshAll);
    socket.on('request:accepted', refreshAll);
    socket.on('request:rejected', refreshAll);
    socket.on('question:new', refreshAll);
    socket.on('question:closed', refreshAll);
    return () => {
      socket.off('message:new', refreshAll);
      socket.off('request:new', refreshAll);
      socket.off('request:accepted', refreshAll);
      socket.off('request:rejected', refreshAll);
      socket.off('question:new', refreshAll);
      socket.off('question:closed', refreshAll);
    };
  }, [isLoggedIn, refreshAll]);

  const toggleNearMe = async () => {
    if (!activeTags.has('near_me')) {
      const next = await ensureLiveCoords();
      if (!next) return;
      setActiveTags((prev) => new Set(prev).add('near_me'));
    } else {
      setActiveTags((prev) => {
        const next = new Set(prev);
        next.delete('near_me');
        return next;
      });
    }
  };

  const toggleTag = useCallback(
    async (key: StatusTagKey) => {
      if (key === 'near_me') {
        toggleNearMe();
        return;
      }
      setActiveTags((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    },
    [activeTags],
  );

  const handleQuestionPress = useCallback(
    (item: TFeedQuestion) => {
      shouldRestoreFeedScrollRef.current = true;
      const route = resolveQuestionCardPress(item, authUserId);
      router.push(route);
    },
    [authUserId, router],
  );

  const displayedItems = useMemo(
    () =>
      filterDisplayedFeedItems(
        feedItems,
        closedItems,
        selectedCategoryKey,
        authUserId,
        activeTags,
        isClosedCategory,
      ),
    [activeTags, authUserId, closedItems, feedItems, isClosedCategory, selectedCategoryKey],
  );

  useEffect(() => {
    setMenuCategories(
      FEED_CATEGORY_DEFS.map((def) => ({
        key: def.key,
        title: def.title,
        count: feedCounts[def.key],
      })),
    );
  }, [feedCounts, setMenuCategories]);

  useEffect(() => {
    resetChrome();
    shouldRestoreFeedScrollRef.current = false;
    feedListRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (selectedCategoryKey === CLOSED_QUESTIONS_CATEGORY_KEY) {
      setSearch('');
      setSearchResults([]);
      setActiveTags(new Set());
      searchInputRef.current?.blur();
    }
  }, [resetChrome, selectedCategoryKey]);

  const activeCategory = useMemo(
    () => FEED_CATEGORY_DEFS.find((def) => def.key === selectedCategoryKey) ?? FEED_CATEGORY_DEFS[0],
    [selectedCategoryKey],
  );

  const categorySubtitle = getHomeCategorySubtitle(selectedCategoryKey);

  const listData = isClosedCategory ? closedItems : isSearchActive ? searchResults : displayedItems;
  const showFeedLoading = isClosedCategory
    ? closedLoading && closedItems.length === 0
    : !isSearchActive && loading && feedItems.length === 0;
  const listGrows = showFeedLoading || listData.length === 0;

  return {
    feedListRef,
    searchInputRef,
    shouldRestoreFeedScrollRef,
    search,
    setSearch,
    searchResults,
    searching,
    activeTags,
    toggleTag,
    unreadChatCount,
    viewMode,
    setViewMode,
    isSearchActive,
    isClosedCategory,
    nearMe,
    coords,
    activeCategory,
    categorySubtitle,
    listData,
    showFeedLoading,
    listGrows,
    handleQuestionPress,
    refreshAll,
  };
};
