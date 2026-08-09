import { colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from 'react-native-svg';

type Variant = 'onPrimary' | 'onWhite';

type Props = {
  variant: Variant;
};

const LOCATION_PIN_PATH =
  'M12 2C7.58 2 4 5.58 4 10c0 6.5 8 14 8 14s8-7.5 8-14c0-4.42-3.58-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z';

/** Full-bleed hero art for the landing screen (white on PRIMARY). */
const HeroArt = () => (
  <Svg width="100%" height="100%" viewBox="0 0 390 560" preserveAspectRatio="xMidYMid slice">
    <Defs>
      <RadialGradient id="authBlobA-hero" cx="50%" cy="50%" rx="50%" ry="50%">
        <Stop offset="0%" stopColor={colors.BG_WHITE} stopOpacity={0.14} />
        <Stop offset="100%" stopColor={colors.BG_WHITE} stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="authBlobB-hero" cx="50%" cy="50%" rx="50%" ry="50%">
        <Stop offset="0%" stopColor={colors.BG_WHITE} stopOpacity={0.1} />
        <Stop offset="100%" stopColor={colors.BG_WHITE} stopOpacity={0} />
      </RadialGradient>
    </Defs>

    <Circle cx="300" cy="120" r="140" fill="url(#authBlobA-hero)" />
    <Circle cx="60" cy="360" r="110" fill="url(#authBlobB-hero)" />

    <G opacity={0.22}>
      <Circle cx="308" cy="268" r="36" fill="none" stroke={colors.BG_WHITE} strokeWidth={1} />
      <Circle cx="308" cy="268" r="72" fill="none" stroke={colors.BG_WHITE} strokeWidth={1} />
      <Circle cx="308" cy="268" r="112" fill="none" stroke={colors.BG_WHITE} strokeWidth={1} />
      <Circle cx="308" cy="268" r="156" fill="none" stroke={colors.BG_WHITE} strokeWidth={0.75} />
    </G>

    <G transform="translate(292, 248) scale(1.15)">
      <Path d={LOCATION_PIN_PATH} fill={colors.BG_WHITE} opacity={0.9} />
    </G>

    <G opacity={0.35}>
      <Path
        d="M88 118c0-4.42 3.58-8 8-8s8 3.58 8 8c0 5.5-8 12-8 12s-8-6.5-8-12z"
        fill="none"
        stroke={colors.BG_WHITE}
        strokeWidth={1.25}
      />
      <Circle cx="96" cy="118" r="2.5" fill={colors.BG_WHITE} />
      <Path
        d="M104 126 C 140 150, 200 190, 268 238"
        fill="none"
        stroke={colors.BG_WHITE}
        strokeWidth={1}
        strokeDasharray="3 6"
        strokeLinecap="round"
      />
    </G>

    <Path
      d="M -20 420 Q 120 360 260 400"
      fill="none"
      stroke={colors.BG_WHITE}
      strokeWidth={0.75}
      opacity={0.12}
    />
  </Svg>
);

/**
 * Corner-only PRIMARY art for sign-in / sign-up.
 * Each panel is clipped so decoration stays in the margins, never over form fields.
 */
const FormBackgroundArt = () => (
  <>
    <View style={styles.topRightCorner}>
      <Svg width="100%" height="100%" viewBox="0 0 220 200" preserveAspectRatio="xMaxYMin slice">
        <Defs>
          <RadialGradient id="authBlob-form-tr" cx="100%" cy="0%" rx="80%" ry="80%">
            <Stop offset="0%" stopColor={colors.PRIMARY} stopOpacity={0.18} />
            <Stop offset="100%" stopColor={colors.PRIMARY} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="220" cy="0" r="160" fill="url(#authBlob-form-tr)" />
        <G opacity={0.28}>
          <Circle cx="220" cy="10" r="48" fill="none" stroke={colors.PRIMARY} strokeWidth={1.5} />
          <Circle cx="220" cy="10" r="88" fill="none" stroke={colors.PRIMARY} strokeWidth={1.5} />
          <Circle cx="220" cy="10" r="132" fill="none" stroke={colors.PRIMARY} strokeWidth={1.25} />
        </G>
        <G transform="translate(198, 28) scale(0.9)" opacity={0.95}>
          <Path d={LOCATION_PIN_PATH} fill={colors.PRIMARY} />
        </G>
      </Svg>
    </View>

    <View style={styles.topLeftCorner}>
      <Svg width="100%" height="100%" viewBox="0 0 120 100">
        <G opacity={0.26}>
          <Path
            d="M28 18c0-5.52 4.48-10 10-10s10 4.48 10 10c0 6.5-10 14-10 14s-10-7.5-10-14z"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={1.5}
          />
          <Circle cx="38" cy="18" r="2.5" fill={colors.PRIMARY} />
        </G>
      </Svg>
    </View>

    <View style={styles.bottomLeftCorner}>
      <Svg width="100%" height="100%" viewBox="0 0 200 180" preserveAspectRatio="xMinYMax slice">
        <Defs>
          <RadialGradient id="authBlob-form-bl" cx="0%" cy="100%" rx="90%" ry="90%">
            <Stop offset="0%" stopColor={colors.PRIMARY} stopOpacity={0.16} />
            <Stop offset="100%" stopColor={colors.PRIMARY} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="0" cy="180" r="130" fill="url(#authBlob-form-bl)" />
        <Path
          d="M -10 150 Q 60 120 140 165"
          fill="none"
          stroke={colors.PRIMARY}
          strokeWidth={1.25}
          opacity={0.24}
        />
      </Svg>
    </View>

    <View style={styles.bottomRightCorner}>
      <Svg width="100%" height="100%" viewBox="0 0 140 120">
        <G opacity={0.24}>
          <Circle cx="120" cy="100" r="56" fill="none" stroke={colors.PRIMARY} strokeWidth={1.25} />
          <Circle cx="120" cy="100" r="92" fill="none" stroke={colors.PRIMARY} strokeWidth={1.25} />
        </G>
      </Svg>
    </View>
  </>
);

/** Decorative sonar rings, pins, and soft blobs for auth screens. */
const AuthScreenArt = ({ variant }: Props) => (
  <View style={styles.container} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {variant === 'onPrimary' ? <HeroArt /> : <FormBackgroundArt />}
  </View>
);

export default AuthScreenArt;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '52%',
    height: '26%',
    overflow: 'hidden',
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 88,
    height: 72,
    overflow: 'hidden',
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '42%',
    height: '20%',
    overflow: 'hidden',
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '38%',
    height: '18%',
    overflow: 'hidden',
  },
});
