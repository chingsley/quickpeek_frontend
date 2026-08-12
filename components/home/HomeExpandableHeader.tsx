import Searchbar from '@/components/Searchbar';
import { FilterTabletGroup } from '@/components/FilterTablet';
import { ScreenTitle } from '@/components/shared/ScreenTitle';
import { HOME_FILTER_TABLET_ITEMS, SEARCH_FILTER_HEADER_GAP } from '@/constants/filterTablets';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { CIRCULAR_CLICK_HEIGHT, CIRCULAR_CLICK_WIDTH } from '@/constants/layout';
import { screenChromeStyles } from '@/constants/screenChrome';
import { StatusTagKey } from '@/utils/questionStatus';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

type HomeExpandableHeaderProps = {
  title: string;
  categorySubtitle: string | null;
  largeTitleStyle: object;
  headerChromeSlideStyle: object;
  isClosedCategory: boolean;
  searchInputRef: React.RefObject<TextInput | null>;
  search: string;
  setSearch: (value: string) => void;
  activeTags: Set<StatusTagKey>;
  toggleTag: (key: StatusTagKey) => void;
  isSearchActive: boolean;
  searching: boolean;
  searchResultCount: number;
  viewMode: 'card' | 'list';
  onToggleViewMode: () => void;
};

const HomeExpandableHeader = ({
  title,
  categorySubtitle,
  largeTitleStyle,
  headerChromeSlideStyle,
  isClosedCategory,
  searchInputRef,
  search,
  setSearch,
  activeTags,
  toggleTag,
  isSearchActive,
  searching,
  searchResultCount,
  viewMode,
  onToggleViewMode,
}: HomeExpandableHeaderProps) => {
  const viewModeToggle = (
    <Pressable
      onPress={onToggleViewMode}
      style={styles.viewModeBtn}
      accessibilityLabel="Toggle view mode"
    >
      <Ionicons
        name={viewMode === 'card' ? 'list-outline' : 'grid-outline'}
        size={22}
        color={colors.PRIMARY}
      />
    </Pressable>
  );

  return (
    <Animated.View style={headerChromeSlideStyle}>
      <Animated.View style={[screenChromeStyles.titleRow, largeTitleStyle]}>
        <ScreenTitle title={title} />
        {categorySubtitle ? (
          <Text style={screenChromeStyles.screenSubtitle}>{categorySubtitle}</Text>
        ) : null}
      </Animated.View>

      {!isClosedCategory ? (
        <Searchbar
          ref={searchInputRef}
          leading="logo"
          placeholder="Search questions"
          inputValue={search}
          setValue={setSearch}
          style={styles.searchBarPlacement}
        />
      ) : null}

      {!isClosedCategory ? (
        <FilterTabletGroup
          items={HOME_FILTER_TABLET_ITEMS}
          activeKeys={activeTags}
          onToggle={toggleTag}
        />
      ) : null}

      {!isClosedCategory ? (
        <>
          {isSearchActive && searching ? (
            <View style={styles.searchLoadingRow}>
              <ActivityIndicator size="small" color={colors.PRIMARY} />
              <Text style={styles.searchLoadingText}>Searching…</Text>
            </View>
          ) : null}

          <View style={styles.filterWrap}>
            {isSearchActive && !searching && searchResultCount > 0 ? (
              <Text style={styles.resultCountText}>
                {searchResultCount} result{searchResultCount === 1 ? '' : 's'}
              </Text>
            ) : null}
            {viewModeToggle}
          </View>
        </>
      ) : (
        <View style={styles.filterWrap}>{viewModeToggle}</View>
      )}
    </Animated.View>
  );
};

export default HomeExpandableHeader;

const styles = StyleSheet.create({
  searchBarPlacement: {
    marginHorizontal: 16,
    marginBottom: SEARCH_FILTER_HEADER_GAP,
  },
  searchLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  searchLoadingText: {
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
  },
  resultCountText: {
    flex: 1,
    fontFamily: fonts.FONT_FAMILY_REGULAR,
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.MEDIUM_GRAY,
  },
  filterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
    marginBottom: 16,
  },
  viewModeBtn: {
    paddingHorizontal: 4,
    marginLeft: 'auto',
    backgroundColor: colors.INPUT_BG,
    width: CIRCULAR_CLICK_WIDTH,
    height: CIRCULAR_CLICK_HEIGHT,
    display: 'flex',
    borderRadius: CIRCULAR_CLICK_WIDTH / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
