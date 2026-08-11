import {
  SCROLL_CHROME_COLLAPSED_TITLE_FADE_IN_END,
  SCROLL_CHROME_COLLAPSED_TITLE_FADE_IN_START,
  SCROLL_CHROME_FADE_OUT_END,
  SCROLL_CHROME_LARGE_TITLE_EXTRA_TRANSLATE_Y,
} from '@/constants/scrollChrome';
import { Extrapolation, interpolate } from 'react-native-reanimated';

export const scrollChromeContentOpacity = (progress: number) => {
  'worklet';
  return interpolate(progress, [0, SCROLL_CHROME_FADE_OUT_END], [1, 0], Extrapolation.CLAMP);
};

export const scrollChromeLargeTitleOpacity = (progress: number) => {
  'worklet';
  return interpolate(
    progress,
    [0, SCROLL_CHROME_FADE_OUT_END * 0.85, SCROLL_CHROME_FADE_OUT_END],
    [1, 0.15, 0],
    Extrapolation.CLAMP,
  );
};

export const scrollChromeLargeTitleTranslateY = (progress: number) => {
  'worklet';
  return interpolate(
    progress,
    [0, 1],
    [0, -SCROLL_CHROME_LARGE_TITLE_EXTRA_TRANSLATE_Y],
    Extrapolation.CLAMP,
  );
};

export const scrollChromeCollapsedTitleOpacity = (progress: number) => {
  'worklet';
  return interpolate(
    progress,
    [0, SCROLL_CHROME_COLLAPSED_TITLE_FADE_IN_START, SCROLL_CHROME_COLLAPSED_TITLE_FADE_IN_END, 1],
    [0, 0, 1, 1],
    Extrapolation.CLAMP,
  );
};

export const scrollChromeCollapsedTitleTranslateY = (progress: number) => {
  'worklet';
  return interpolate(
    progress,
    [0, SCROLL_CHROME_COLLAPSED_TITLE_FADE_IN_END, 1],
    [6, 2, 0],
    Extrapolation.CLAMP,
  );
};
