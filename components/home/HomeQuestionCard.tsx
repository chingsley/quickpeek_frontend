import QuestionStatusIcons from '@/components/QuestionStatusIcons';
import { colors } from '@/constants/colors';
import { feedCardStyles } from '@/constants/feedCard';
import { fonts } from '@/constants/fonts';
import { STATUS_ICON_SIZE } from '@/constants/statusIcons';
import { QuestionStatus, TFeedQuestion } from '@/types/question.types';
import { formatRelativeTime } from '@/utils/date';
import { getMainStatusIcons } from '@/utils/questionStatus';
import { questionHasFeedAttention } from '@/utils/questionFeedAttention';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HomeQuestionCardProps = {
  item: TFeedQuestion;
  viewMode: 'card' | 'list';
  authUserId: string | undefined;
  onPress: (item: TFeedQuestion) => void;
};

const HomeQuestionCard = ({ item, viewMode, authUserId, onPress }: HomeQuestionCardProps) => {
  const showAttentionDot = questionHasFeedAttention(item);
  const postedAt =
    item.status === QuestionStatus.Closed && item.closedAt
      ? `Closed ${formatRelativeTime(item.closedAt)}`
      : formatRelativeTime(item.createdAt);
  const authorLabel = item.questioner
    ? item.questioner.id === authUserId
      ? 'You'
      : item.questioner.name
    : null;
  const mainIcons = getMainStatusIcons(item, authUserId);
  const isOutgoing = item.userId === authUserId;
  const showDistance =
    !isOutgoing &&
    item.locationScope != null &&
    item.locationScope !== 'ANYWHERE' &&
    item.latitude != null &&
    item.longitude != null &&
    item.distanceKm != null;

  return (
    <TouchableOpacity
      style={viewMode === 'card' ? feedCardStyles.card : styles.listItem}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardMeta}>
        <View style={styles.cardMetaLeft}>
          {authorLabel ? (
            <Text style={styles.questioner} numberOfLines={1}>
              {authorLabel}
            </Text>
          ) : null}
          {authorLabel ? <Text style={styles.metaDivider}>|</Text> : null}
          <Text style={styles.postedAt}>{postedAt}</Text>
        </View>
        <View style={styles.cardMetaRight}>
          {showAttentionDot ? <View style={styles.unreadDot} /> : null}
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      </View>
      <Text style={styles.cardDetail} numberOfLines={viewMode === 'card' ? 3 : 2}>
        {item.detail}
      </Text>
      {(mainIcons.length > 0 || showDistance) && (
        <View style={styles.cardFooter}>
          {mainIcons.length > 0 ? (
            <QuestionStatusIcons icons={mainIcons} size={STATUS_ICON_SIZE} />
          ) : null}
          {showDistance ? (
            <Text style={styles.distance}>{item.distanceKm!.toFixed(1)} km away</Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default HomeQuestionCard;

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: colors.BG_WHITE,
    borderBottomWidth: 1,
    borderBottomColor: colors.CARD_BORDER,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  cardMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  cardMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  cardHeader: { marginBottom: 6 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.RED },
  cardTitle: {
    fontFamily: 'roboto-medium',
    fontSize: fonts.FONT_SIZE_MEDIUM,
    color: colors.TEXT_DARK,
  },
  price: {
    fontFamily: 'roboto-bold',
    fontSize: fonts.FONT_SIZE_MEDIUM,
    color: colors.PRIMARY,
  },
  cardDetail: {
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.MEDIUM_GRAY,
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  questioner: {
    flexShrink: 1,
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.PRIMARY,
  },
  metaDivider: {
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
  },
  distance: {
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
    marginLeft: 'auto',
  },
  postedAt: {
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_XS,
    color: colors.MEDIUM_GRAY,
  },
});
