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
 * "Local constellation" — connected nodes, horizon curves, and soft washes
 * that suggest people nearby without overlapping the form.
 */
const FormBackgroundArt = () => (
  <>
    {/* Top-right — nearby network cluster */}
    <View style={styles.topRightCorner}>
      <Svg width="100%" height="100%" viewBox="0 0 240 210" preserveAspectRatio="xMaxYMin slice">
        <Defs>
          <RadialGradient id="authFormGlowTR" cx="85%" cy="15%" rx="70%" ry="70%">
            <Stop offset="0%" stopColor={colors.PRIMARY} stopOpacity={0.16} />
            <Stop offset="55%" stopColor={colors.LIGHT_BLUE} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={colors.PRIMARY} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="210" cy="20" r="150" fill="url(#authFormGlowTR)" />
        <G opacity={0.22}>
          <Path
            d="M 118 58 C 148 42, 178 48, 204 72"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={1.25}
            strokeLinecap="round"
          />
          <Path
            d="M 132 88 C 162 74, 188 82, 214 104"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray="4 7"
          />
          <Path
            d="M 96 78 C 126 96, 156 88, 186 108"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={0.9}
            strokeLinecap="round"
            opacity={0.7}
          />
        </G>
        <G>
          <Circle cx="204" cy="72" r="14" fill={colors.SECONDARY} opacity={0.9} />
          <Circle cx="204" cy="72" r="14" fill="none" stroke={colors.PRIMARY} strokeWidth={1.25} opacity={0.45} />
          <Circle cx="204" cy="72" r="4" fill={colors.PRIMARY} opacity={0.85} />
          <Circle cx="132" cy="88" r="3" fill={colors.PRIMARY} opacity={0.35} />
          <Circle cx="186" cy="108" r="3.5" fill={colors.PRIMARY} opacity={0.5} />
          <Circle cx="118" cy="58" r="2.5" fill={colors.PRIMARY} opacity={0.28} />
        </G>
      </Svg>
    </View>

    {/* Top-left — horizon arcs */}
    <View style={styles.topLeftCorner}>
      <Svg width="100%" height="100%" viewBox="0 0 160 110">
        <G opacity={0.2}>
          <Path
            d="M -8 72 Q 52 38, 120 58"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d="M -4 88 Q 60 58, 132 76"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={1}
            strokeLinecap="round"
          />
          <Path
            d="M 0 104 Q 64 78, 148 94"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={0.75}
            strokeLinecap="round"
            opacity={0.65}
          />
        </G>
        <Circle cx="46" cy="52" r="3" fill={colors.PRIMARY} opacity={0.3} />
        <Circle cx="46" cy="52" r="10" fill="none" stroke={colors.PRIMARY} strokeWidth={0.75} opacity={0.18} />
      </Svg>
    </View>

    {/* Bottom-left — flowing contours */}
    <View style={styles.bottomLeftCorner}>
      <Svg width="100%" height="100%" viewBox="0 0 220 200" preserveAspectRatio="xMinYMax slice">
        <Defs>
          <RadialGradient id="authFormGlowBL" cx="0%" cy="100%" rx="85%" ry="85%">
            <Stop offset="0%" stopColor={colors.PRIMARY} stopOpacity={0.14} />
            <Stop offset="100%" stopColor={colors.PRIMARY} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="0" cy="200" r="145" fill="url(#authFormGlowBL)" />
        <G opacity={0.24}>
          <Path
            d="M -20 148 Q 40 118, 110 138 T 200 128"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={1.25}
            strokeLinecap="round"
          />
          <Path
            d="M -16 168 Q 48 142, 118 158 T 208 148"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={1}
            strokeLinecap="round"
          />
          <Path
            d="M -12 186 Q 54 164, 126 178 T 214 166"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={0.75}
            strokeLinecap="round"
            opacity={0.6}
          />
        </G>
        <Circle cx="72" cy="156" r="2.5" fill={colors.PRIMARY} opacity={0.4} />
      </Svg>
    </View>

    {/* Bottom-right — constellation */}
    <View style={styles.bottomRightCorner}>
      <Svg width="100%" height="100%" viewBox="0 0 180 150">
        <G opacity={0.2}>
          <Path
            d="M 108 34 L 138 52 L 126 82 L 94 74 Z"
            fill="none"
            stroke={colors.PRIMARY}
            strokeWidth={0.9}
            strokeLinejoin="round"
          />
          <Path d="M 108 34 L 94 74" stroke={colors.PRIMARY} strokeWidth={0.75} opacity={0.5} />
          <Path d="M 138 52 L 156 68" stroke={colors.PRIMARY} strokeWidth={0.75} strokeDasharray="3 5" />
        </G>
        <Circle cx="108" cy="34" r="3.5" fill={colors.PRIMARY} opacity={0.55} />
        <Circle cx="138" cy="52" r="2.5" fill={colors.PRIMARY} opacity={0.4} />
        <Circle cx="126" cy="82" r="3" fill={colors.PRIMARY} opacity={0.35} />
        <Circle cx="94" cy="74" r="2" fill={colors.PRIMARY} opacity={0.28} />
        <Circle cx="156" cy="68" r="2" fill={colors.PRIMARY} opacity={0.22} />
        <Circle cx="148" cy="108" r="24" fill="none" stroke={colors.PRIMARY} strokeWidth={0.75} opacity={0.14} />
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
    width: '56%',
    height: '28%',
    overflow: 'hidden',
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 88,
    overflow: 'hidden',
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '48%',
    height: '22%',
    overflow: 'hidden',
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '42%',
    height: '20%',
    overflow: 'hidden',
  },
});
