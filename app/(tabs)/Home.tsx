import HomeExpandableHeader from '@/components/home/HomeExpandableHeader';
import HomeFeedList from '@/components/home/HomeFeedList';
import HomeFloatingAskButton from '@/components/home/HomeFloatingAskButton';
import HomePinnedToolbar from '@/components/home/HomePinnedToolbar';
import { colors } from '@/constants/colors';
import { HOME_COLLAPSED_HEADER_HEIGHT } from '@/constants/homeChrome';
import { CIRCULAR_CLICK_HEIGHT } from '@/constants/layout';
import { SCROLL_CHROME_PINNED_ACTION_ROW_MARGIN_TOP } from '@/constants/scrollChrome';
import { useHomeFeed } from '@/hooks/useHomeFeed';
import { useHomeFeedScroll } from '@/hooks/useHomeFeedScroll';
import { useHomeFloatingAskStyle, useHomeScrollChrome } from '@/hooks/useHomeScrollChrome';
import { useAuthStore } from '@/store/auth.store';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const authUserId = useAuthStore((state) => state.user?.id);

  const {
    scrollHandler,
    headerShellStyle,
    headerChromeSlideStyle,
    largeTitleStyle,
    collapsedTitleStyle,
    toolbarStripStyle,
    onHeaderLayout,
    resetChrome,
  } = useHomeScrollChrome();

  const { fabContainerStyle, fabTextStyle } = useHomeFloatingAskStyle(tabBarHeight);

  const feed = useHomeFeed(resetChrome);

  const { feedScrollHandler } = useHomeFeedScroll({
    feedListRef: feed.feedListRef,
    searchInputRef: feed.searchInputRef,
    scrollHandler,
    shouldRestoreFeedScrollRef: feed.shouldRestoreFeedScrollRef,
    refreshAll: feed.refreshAll,
    isSearchActive: feed.isSearchActive,
    searching: feed.searching,
  });

  const pinnedToolbarHeight = insets.top + HOME_COLLAPSED_HEADER_HEIGHT;
  const headerContentTop =
    insets.top + SCROLL_CHROME_PINNED_ACTION_ROW_MARGIN_TOP + CIRCULAR_CLICK_HEIGHT;

  const handleToggleViewMode = useCallback(() => {
    feed.setViewMode((mode) => (mode === 'card' ? 'list' : 'card'));
  }, [feed.setViewMode]);

  return (
    <View style={styles.safeArea}>
      <TouchableWithoutFeedback
        accessible={false}
        onPress={() => KeyboardController.dismiss()}
      >
        <View
          style={[
            styles.screenBody,
            {
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          <Animated.View style={[styles.headerShell, headerShellStyle]}>
            <View
              style={[styles.headerMeasureWrap, { top: headerContentTop }]}
              onLayout={(event) => onHeaderLayout(event.nativeEvent.layout.height, insets.top)}
            >
              <HomeExpandableHeader
                title={feed.activeCategory.title}
                categorySubtitle={feed.categorySubtitle}
                largeTitleStyle={largeTitleStyle}
                headerChromeSlideStyle={headerChromeSlideStyle}
                isClosedCategory={feed.isClosedCategory}
                searchInputRef={feed.searchInputRef}
                search={feed.search}
                setSearch={feed.setSearch}
                activeTags={feed.activeTags}
                toggleTag={feed.toggleTag}
                isSearchActive={feed.isSearchActive}
                searching={feed.searching}
                searchResultCount={feed.searchResults.length}
                viewMode={feed.viewMode}
                onToggleViewMode={handleToggleViewMode}
              />
            </View>
          </Animated.View>

          <HomeFeedList
            feedListRef={feed.feedListRef}
            listData={feed.listData}
            showFeedLoading={feed.showFeedLoading}
            listGrows={feed.listGrows}
            viewMode={feed.viewMode}
            authUserId={authUserId}
            onQuestionPress={feed.handleQuestionPress}
            feedScrollHandler={feedScrollHandler}
            isSearchActive={feed.isSearchActive}
            searching={feed.searching}
            search={feed.search}
            isClosedCategory={feed.isClosedCategory}
            nearMe={feed.nearMe}
            hasCoords={feed.coords != null}
          />

          <HomePinnedToolbar
            title={feed.activeCategory.title}
            collapsedTitleStyle={collapsedTitleStyle}
            toolbarStripStyle={toolbarStripStyle}
            height={pinnedToolbarHeight}
            unreadChatCount={feed.unreadChatCount}
          />
        </View>
      </TouchableWithoutFeedback>

      <HomeFloatingAskButton
        fabContainerStyle={fabContainerStyle}
        fabTextStyle={fabTextStyle}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.BG_WHITE,
  },
  screenBody: {
    flex: 1,
    backgroundColor: colors.BG_WHITE,
  },
  headerShell: {
    overflow: 'hidden',
    backgroundColor: colors.BG_WHITE,
    zIndex: 2,
    position: 'relative',
  },
  headerMeasureWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
