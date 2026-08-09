export const SLIDE_TRACK_HEIGHT = 50;
/** Horizontal inset for the sliding fill inside the track. */
export const SLIDE_TRACK_INSET = 4;
/** Fill height matches the track — one constant for both. */
export const SLIDE_THUMB_HEIGHT = SLIDE_TRACK_HEIGHT;
/** Minimum pill width at rest — arrow only, no label. */
export const SLIDE_THUMB_WIDTH = 80;
export const SLIDE_COMPLETE_RATIO = 0.85;

export const SLIDE_PROCESSING_LABEL = 'Processing...';
export const SLIDE_SUCCESS_LABEL = 'Successful';

export const getSlideInnerWidth = (trackWidth: number): number =>
  Math.max(0, trackWidth - SLIDE_TRACK_INSET * 2);

export const getSlideMaxOffset = (trackWidth: number): number => {
  'worklet';
  return Math.max(0, getSlideInnerWidth(trackWidth) - SLIDE_THUMB_WIDTH);
};

export const getSlideFillWidth = (offset: number): number => SLIDE_THUMB_WIDTH + offset;

export const isSlideComplete = (offset: number, maxOffset: number): boolean => {
  'worklet';
  return maxOffset > 0 && offset >= maxOffset * SLIDE_COMPLETE_RATIO;
};
