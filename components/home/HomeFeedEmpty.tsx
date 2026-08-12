import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type HomeFeedEmptyProps = {
  showFeedLoading: boolean;
  isSearchActive: boolean;
  searching: boolean;
  search: string;
  isClosedCategory: boolean;
  nearMe: boolean;
  hasCoords: boolean;
};

const HomeFeedEmpty = ({
  showFeedLoading,
  isSearchActive,
  searching,
  search,
  isClosedCategory,
  nearMe,
  hasCoords,
}: HomeFeedEmptyProps) => {
  if (showFeedLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (isSearchActive) {
    if (searching) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No questions match "{search.trim()}".</Text>
      </View>
    );
  }

  if (isClosedCategory) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>You have no closed questions yet.</Text>
        <Text style={styles.emptyHelper}>
          When you close a question, it moves here and is hidden from responders.
        </Text>
      </View>
    );
  }

  if (nearMe && !hasCoords) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          Enable your location to see questions close to you.
        </Text>
      </View>
    );
  }

  if (nearMe) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          No open questions close to you right now. Try turning off the Near me filter to see more.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No open questions yet.</Text>
    </View>
  );
};

export default HomeFeedEmpty;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.MEDIUM_GRAY,
    textAlign: 'center',
  },
  emptyHelper: {
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
