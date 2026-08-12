import HomeListBottomSpacer from '@/components/HomeListBottomSpacer';
import HomeFeedEmpty from '@/components/home/HomeFeedEmpty';
import HomeQuestionCard from '@/components/home/HomeQuestionCard';
import { TFeedQuestion } from '@/types/question.types';
import React, { useCallback } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated';

type HomeFeedListProps = {
  feedListRef: React.RefObject<Animated.FlatList<TFeedQuestion> | null>;
  listData: TFeedQuestion[];
  showFeedLoading: boolean;
  listGrows: boolean;
  viewMode: 'card' | 'list';
  authUserId: string | undefined;
  onQuestionPress: (item: TFeedQuestion) => void;
  feedScrollHandler: ScrollHandlerProcessed;
  isSearchActive: boolean;
  searching: boolean;
  search: string;
  isClosedCategory: boolean;
  nearMe: boolean;
  hasCoords: boolean;
};

const HomeFeedList = ({
  feedListRef,
  listData,
  showFeedLoading,
  listGrows,
  viewMode,
  authUserId,
  onQuestionPress,
  feedScrollHandler,
  isSearchActive,
  searching,
  search,
  isClosedCategory,
  nearMe,
  hasCoords,
}: HomeFeedListProps) => {
  const renderQuestion = useCallback(
    ({ item }: { item: TFeedQuestion }) => (
      <HomeQuestionCard
        item={item}
        viewMode={viewMode}
        authUserId={authUserId}
        onPress={onQuestionPress}
      />
    ),
    [authUserId, onQuestionPress, viewMode],
  );

  const renderListEmpty = useCallback(
    () => (
      <HomeFeedEmpty
        showFeedLoading={showFeedLoading}
        isSearchActive={isSearchActive}
        searching={searching}
        search={search}
        isClosedCategory={isClosedCategory}
        nearMe={nearMe}
        hasCoords={hasCoords}
      />
    ),
    [
      showFeedLoading,
      isSearchActive,
      searching,
      search,
      isClosedCategory,
      nearMe,
      hasCoords,
    ],
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.listAvoider}
    >
      <Animated.FlatList
        ref={feedListRef}
        data={showFeedLoading ? [] : listData}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestion}
        contentContainerStyle={[styles.listContent, listGrows && styles.listContentGrow]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={HomeListBottomSpacer}
        onScroll={feedScrollHandler}
        scrollEventThrottle={16}
      />
    </KeyboardAvoidingView>
  );
};

export default HomeFeedList;

const styles = StyleSheet.create({
  listAvoider: { flex: 1 },
  listContent: { paddingHorizontal: 16 },
  listContentGrow: { flexGrow: 1 },
});
