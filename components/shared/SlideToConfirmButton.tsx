import {
  isSlideComplete,
  SLIDE_PROCESSING_LABEL,
  SLIDE_SUCCESS_LABEL,
  SLIDE_THUMB_WIDTH,
  SLIDE_TRACK_HEIGHT,
  SLIDE_TRACK_INSET,
} from '@/components/shared/slideToConfirm.utils';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { BORDER_RADIUS_PILL } from '@/constants/layout';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  label: string;
  onConfirm: () => void;
  loading?: boolean;
  success?: boolean;
  processingLabel?: string;
  successLabel?: string;
  disabled?: boolean;
  resetKey?: string | number;
  testID?: string;
};

const SPRING_CONFIG = { damping: 20, stiffness: 220 };
const ARROW_ICON_SIZE = 24;
const ARROW_RIGHT_INSET = 14;

const SlideToConfirmButton = ({
  label,
  onConfirm,
  loading = false,
  success = false,
  processingLabel = SLIDE_PROCESSING_LABEL,
  successLabel = SLIDE_SUCCESS_LABEL,
  disabled = false,
  resetKey,
  testID = 'slide-to-confirm',
}: Props) => {
  const [isCommitted, setIsCommitted] = useState(false);
  const dragOffset = useSharedValue(0);
  const dragStartOffset = useSharedValue(0);
  const maxOffset = useSharedValue(0);
  const trackWidth = useSharedValue(0);
  const isLocked = useSharedValue(0);
  const allowDrag = useSharedValue(1);
  const hasTriggeredRef = useRef(false);
  const wasLoadingRef = useRef(false);
  const onConfirmRef = useRef(onConfirm);
  const isInteractive = !disabled && !loading && !success && !isCommitted;

  onConfirmRef.current = onConfirm;

  const resetSlide = useCallback(() => {
    allowDrag.value = 1;
    isLocked.value = 0;
    hasTriggeredRef.current = false;
    wasLoadingRef.current = false;
    setIsCommitted(false);
    dragOffset.value = withSpring(0, SPRING_CONFIG);
  }, [allowDrag, dragOffset, isLocked]);

  useEffect(() => {
    resetSlide();
  }, [resetKey, resetSlide]);

  useEffect(() => {
    if (success) {
      allowDrag.value = 0;
      isLocked.value = 1;
      setIsCommitted(true);
      return;
    }
    if (loading) {
      wasLoadingRef.current = true;
      allowDrag.value = 0;
      isLocked.value = 1;
      setIsCommitted(true);
      return;
    }
    if (wasLoadingRef.current) {
      wasLoadingRef.current = false;
      resetSlide();
    }
  }, [allowDrag, isLocked, loading, resetSlide, success]);

  const commitSlide = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    allowDrag.value = 0;
    setIsCommitted(true);
    onConfirmRef.current();
  }, [allowDrag]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = event.nativeEvent.layout.width;
      trackWidth.value = width;
      maxOffset.value = Math.max(0, width - SLIDE_THUMB_WIDTH - SLIDE_TRACK_INSET * 2);
    },
    [maxOffset, trackWidth],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-8, 8])
        .failOffsetY([-12, 12])
        .onBegin(() => {
          if (!allowDrag.value) return;
          dragStartOffset.value = dragOffset.value;
        })
        .onUpdate((event) => {
          if (!allowDrag.value) return;
          const next = dragStartOffset.value + event.translationX;
          const limit = maxOffset.value;
          dragOffset.value = Math.min(Math.max(0, next), limit);
        })
        .onEnd(() => {
          if (!allowDrag.value) return;
          const limit = maxOffset.value;
          if (isSlideComplete(dragOffset.value, limit)) {
            allowDrag.value = 0;
            isLocked.value = 1;
            dragOffset.value = withSpring(limit, SPRING_CONFIG);
            runOnJS(commitSlide)();
            return;
          }
          dragOffset.value = withSpring(0, SPRING_CONFIG);
        }),
    [allowDrag, commitSlide, dragOffset, dragStartOffset, isLocked, maxOffset],
  );

  const fillAnimatedStyle = useAnimatedStyle(() => ({
    width: isLocked.value ? trackWidth.value : SLIDE_THUMB_WIDTH + dragOffset.value,
  }));

  const trackLabelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isLocked.value
      ? 0
      : maxOffset.value > 0
        ? interpolate(
            SLIDE_THUMB_WIDTH + dragOffset.value,
            [SLIDE_THUMB_WIDTH, SLIDE_THUMB_WIDTH + maxOffset.value * 0.4],
            [1, 0],
            Extrapolation.CLAMP,
          )
        : 1,
  }));

  const fillLabelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isLocked.value
      ? 0
      : interpolate(
          SLIDE_THUMB_WIDTH + dragOffset.value,
          [SLIDE_THUMB_WIDTH + 16, SLIDE_THUMB_WIDTH + 80],
          [0, 1],
          Extrapolation.CLAMP,
        ),
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => {
    if (isLocked.value) {
      return { opacity: 0 };
    }
    const fillWidth = SLIDE_THUMB_WIDTH + dragOffset.value;
    const centeredLeft = (fillWidth - ARROW_ICON_SIZE) / 2;
    const rightAlignedLeft = fillWidth - ARROW_RIGHT_INSET - ARROW_ICON_SIZE;
    return {
      opacity: 1,
      left: interpolate(
        fillWidth,
        [SLIDE_THUMB_WIDTH, SLIDE_THUMB_WIDTH + 72],
        [centeredLeft, rightAlignedLeft],
        Extrapolation.CLAMP,
      ),
    };
  });

  const statusLabel = success ? successLabel : processingLabel;
  const showStatus = isCommitted || loading || success;
  const accessibilityLabel = showStatus ? statusLabel : label;

  return (
    <View
      style={[styles.track, disabled && !isCommitted && styles.trackDisabled]}
      onLayout={handleLayout}
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
    >
      <Animated.Text style={[styles.trackLabel, trackLabelAnimatedStyle]} pointerEvents="none">
        {label}
      </Animated.Text>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.fill,
            fillAnimatedStyle,
            disabled && !isCommitted && styles.fillDisabled,
          ]}
          testID={`${testID}-thumb`}
        >
          {showStatus ? (
            <Text
              style={styles.statusLabel}
              numberOfLines={1}
              pointerEvents="none"
              testID={`${testID}-status`}
            >
              {statusLabel}
            </Text>
          ) : (
            <>
              <Animated.Text
                style={[styles.fillLabel, fillLabelAnimatedStyle]}
                numberOfLines={1}
                pointerEvents="none"
              >
                {label}
              </Animated.Text>
              <Animated.View style={[styles.arrowIcon, arrowAnimatedStyle]}>
                <Ionicons name="arrow-forward" size={ARROW_ICON_SIZE} color={colors.BG_WHITE} />
              </Animated.View>
            </>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SlideToConfirmButton;

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: SLIDE_TRACK_HEIGHT,
    borderRadius: BORDER_RADIUS_PILL,
    backgroundColor: colors.SECONDARY,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  trackDisabled: {
    opacity: 0.72,
  },
  trackLabel: {
    fontFamily: fonts.FONT_FAMILY_MEDIUM,
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.MEDIUM_GRAY,
    textAlign: 'center',
    paddingHorizontal: SLIDE_THUMB_WIDTH,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: SLIDE_TRACK_HEIGHT,
    borderRadius: BORDER_RADIUS_PILL,
    backgroundColor: colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fillDisabled: {
    backgroundColor: colors.LIGHT_GRAY,
  },
  fillLabel: {
    flex: 1,
    fontFamily: fonts.FONT_FAMILY_MEDIUM,
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.BG_WHITE,
    textAlign: 'center',
    paddingRight: ARROW_ICON_SIZE + ARROW_RIGHT_INSET,
  },
  statusLabel: {
    ...StyleSheet.absoluteFillObject,
    fontFamily: fonts.FONT_FAMILY_MEDIUM,
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.BG_WHITE,
    textAlign: 'center',
    lineHeight: SLIDE_TRACK_HEIGHT,
    paddingHorizontal: 16,
  },
  arrowIcon: {
    position: 'absolute',
    top: (SLIDE_TRACK_HEIGHT - ARROW_ICON_SIZE) / 2,
    width: ARROW_ICON_SIZE,
    height: ARROW_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
