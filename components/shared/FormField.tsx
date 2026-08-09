import FormFieldFooter from '@/components/shared/FormFieldFooter';
import { FORM_FIELD_INPUT_PADDING_HORIZONTAL, FORM_FIELD_VERTICAL_GAP } from '@/constants/formField';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { BORDER_RADIUS_INPUT, BORDER_RADIUS_PILL } from '@/constants/layout';
import { TEXT_INPUT_CLIPBOARD_PROPS } from '@/constants/textInput';
import React, { useEffect, useState } from 'react';
import {
  KeyboardTypeOptions,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Shows a live "x / max" counter and caps the input length. */
  maxLength?: number;
  /** Error message in the footer row (left); also turns the border red. */
  error?: string | null;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  inputMode?: TextInputProps['inputMode'];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const ANIMATION_DURATION_MS = 180;
const SINGLE_LINE_HEIGHT = 56;
const MULTILINE_MIN_HEIGHT = 100;
const LABEL_FLOAT_TOP = 7;
const LABEL_REST_TOP_SINGLE = 17;
const LABEL_REST_TOP_MULTILINE = 40;
const INPUT_PADDING_TOP = 30;
const INPUT_PADDING_BOTTOM = 10;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

/**
 * Labeled form input with a floating label inside the field border.
 * The label rests in the center when empty; on focus or when filled it animates
 * to the top of the input. Footer row shows errors and an optional counter.
 */
const FormField = ({
  label,
  value,
  onChangeText,
  maxLength,
  error,
  multiline,
  keyboardType,
  inputMode,
  secureTextEntry,
  autoCapitalize,
  autoComplete,
  style,
  testID,
}: FormFieldProps) => {
  const [focused, setFocused] = useState(false);
  const progress = useSharedValue(value.length > 0 ? 1 : 0);
  const isActive = focused || value.length > 0;
  const labelRestTop = multiline ? LABEL_REST_TOP_MULTILINE : LABEL_REST_TOP_SINGLE;

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [isActive, progress]);

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    top: interpolate(progress.value, [0, 1], [labelRestTop, LABEL_FLOAT_TOP]),
    fontSize: interpolate(progress.value, [0, 1], [fonts.FONT_SIZE_SMALL, fonts.FONT_SIZE_XS]),
    color: interpolateColor(progress.value, [0, 1], [colors.PLACEHOLDER, colors.PRIMARY]),
  }));

  const borderColor = error ? colors.RED : focused ? colors.PRIMARY : colors.LIGHT_GRAY;

  return (
    <View style={[styles.field, style]}>
      <View
        style={[
          styles.inputContainer,
          multiline ? styles.inputContainerMultiline : styles.inputContainerSingle,
          { borderColor },
        ]}
        testID={testID ? `${testID}-container` : undefined}
      >
        <Animated.Text
          pointerEvents="none"
          style={[styles.floatingLabel, labelAnimatedStyle]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
        <AnimatedTextInput
          {...TEXT_INPUT_CLIPBOARD_PROPS}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            Platform.OS === 'web' && styles.inputWeb,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          multiline={multiline}
          keyboardType={keyboardType}
          inputMode={inputMode}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textAlignVertical={multiline ? 'top' : 'center'}
          accessibilityLabel={label}
          testID={testID}
        />
      </View>
      <FormFieldFooter error={error} valueLength={value.length} maxLength={maxLength} />
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  field: {
    width: '100%',
    alignSelf: 'stretch',
    marginBottom: FORM_FIELD_VERTICAL_GAP,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    borderWidth: 1,
    backgroundColor: colors.BG_WHITE,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inputContainerSingle: {
    height: SINGLE_LINE_HEIGHT,
    borderRadius: BORDER_RADIUS_PILL,
  },
  inputContainerMultiline: {
    minHeight: MULTILINE_MIN_HEIGHT,
    borderRadius: BORDER_RADIUS_INPUT,
  },
  floatingLabel: {
    position: 'absolute',
    left: FORM_FIELD_INPUT_PADDING_HORIZONTAL,
    right: FORM_FIELD_INPUT_PADDING_HORIZONTAL,
    fontFamily: fonts.FONT_FAMILY_MEDIUM,
    zIndex: 1,
  },
  input: {
    width: '100%',
    borderWidth: 0,
    paddingHorizontal: FORM_FIELD_INPUT_PADDING_HORIZONTAL,
    paddingTop: INPUT_PADDING_TOP,
    paddingBottom: INPUT_PADDING_BOTTOM,
    fontFamily: fonts.FONT_FAMILY_REGULAR,
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.TEXT_DARK,
    backgroundColor: colors.TRANSPARENT,
  },
  multilineInput: {
    minHeight: MULTILINE_MIN_HEIGHT - 2,
    lineHeight: 22,
  },
  inputWeb: {
    userSelect: 'text',
  } as TextStyle,
});
