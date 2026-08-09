import {
  getSlideFillWidth,
  getSlideInnerWidth,
  getSlideMaxOffset,
  isSlideComplete,
  SLIDE_COMPLETE_RATIO,
  SLIDE_THUMB_HEIGHT,
  SLIDE_THUMB_WIDTH,
  SLIDE_TRACK_HEIGHT,
  SLIDE_TRACK_INSET,
} from '@/components/shared/slideToConfirm.utils';

describe('slideToConfirm.utils', () => {
  it('exposes stable layout constants', () => {
    expect(SLIDE_TRACK_HEIGHT).toBe(50);
    expect(SLIDE_TRACK_INSET).toBe(4);
    expect(SLIDE_THUMB_HEIGHT).toBe(SLIDE_TRACK_HEIGHT);
    expect(SLIDE_THUMB_WIDTH).toBe(80);
    expect(SLIDE_COMPLETE_RATIO).toBe(0.85);
  });

  it('computes inner track width and max drag offset', () => {
    expect(getSlideInnerWidth(0)).toBe(0);
    expect(getSlideInnerWidth(300)).toBe(300 - SLIDE_TRACK_INSET * 2);
    expect(getSlideMaxOffset(0)).toBe(0);
    expect(getSlideMaxOffset(300)).toBe(300 - SLIDE_THUMB_WIDTH - SLIDE_TRACK_INSET * 2);
  });

  it('grows fill width from the minimum pill size as the user drags', () => {
    expect(getSlideFillWidth(0)).toBe(SLIDE_THUMB_WIDTH);
    expect(getSlideFillWidth(40)).toBe(SLIDE_THUMB_WIDTH + 40);
    expect(getSlideFillWidth(getSlideMaxOffset(300))).toBe(getSlideInnerWidth(300));
  });

  it('detects a completed slide past the threshold', () => {
    const max = getSlideMaxOffset(300);
    expect(isSlideComplete(0, max)).toBe(false);
    expect(isSlideComplete(max * 0.84, max)).toBe(false);
    expect(isSlideComplete(max * 0.85, max)).toBe(true);
    expect(isSlideComplete(max, max)).toBe(true);
    expect(isSlideComplete(10, 0)).toBe(false);
  });
});
