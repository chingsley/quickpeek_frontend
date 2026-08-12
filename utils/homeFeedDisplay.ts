import {
  ALL_QUESTIONS_CATEGORY_KEY,
  CLOSED_QUESTIONS_CATEGORY_KEY,
  INCOMING_CATEGORY_KEY,
  OUTGOING_CATEGORY_KEY,
} from '@/constants/feedCategories';
import { TFeedQuestion } from '@/types/question.types';
import { questionMatchesTag, StatusTagKey } from '@/utils/questionStatus';
import { sortFeedByDefaultPriority } from '@/utils/questionFeedSort';

export const getHomeCategorySubtitle = (selectedCategoryKey: string): string | null => {
  if (selectedCategoryKey === INCOMING_CATEGORY_KEY) return 'From other people';
  if (selectedCategoryKey === OUTGOING_CATEGORY_KEY) return 'Asked by you';
  if (selectedCategoryKey === CLOSED_QUESTIONS_CATEGORY_KEY) return 'Only you can view these';
  return null;
};

export const filterDisplayedFeedItems = (
  feedItems: TFeedQuestion[],
  closedItems: TFeedQuestion[],
  selectedCategoryKey: string,
  authUserId: string | undefined,
  activeTags: Set<StatusTagKey>,
  isClosedCategory: boolean,
): TFeedQuestion[] => {
  if (isClosedCategory) {
    return closedItems;
  }

  let items = feedItems;

  if (selectedCategoryKey === INCOMING_CATEGORY_KEY) {
    items = items.filter((item) => item.userId !== authUserId);
  } else if (selectedCategoryKey === OUTGOING_CATEGORY_KEY) {
    items = items.filter((item) => item.userId === authUserId);
  }

  if (activeTags.size > 0) {
    items = items.filter((item) => {
      for (const tag of activeTags) {
        if (!questionMatchesTag(item, authUserId, tag)) return false;
      }
      return true;
    });
  }

  const isDefaultFeedView =
    selectedCategoryKey === ALL_QUESTIONS_CATEGORY_KEY && activeTags.size === 0;
  if (isDefaultFeedView) {
    items = sortFeedByDefaultPriority(items, authUserId);
  }

  return items;
};
