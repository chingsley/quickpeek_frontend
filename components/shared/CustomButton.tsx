// components / Shared / CustomButton.tsx

import { colors } from '@/constants/colors';
import React from 'react';
import {
  ActivityIndicator, GestureResponderEvent,
  StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';


interface CustomButtonProps {
  text: string;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  loading?: boolean;
  disabled?: boolean;
  style?: Object;
  noTopMargin?: boolean;
  fullWidth?: boolean;
  variant?: 'filled' | 'outline';
}
const CustomButton = ({
  onPress,
  text,
  loading,
  disabled,
  style,
  noTopMargin,
  fullWidth,
  variant = 'filled',
}: CustomButtonProps) => {
  const isLoading = !!loading;
  const isOutline = variant === 'outline';

  return (
    <View style={[fullWidth && styles.wrapFullWidth, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.btn,
          isOutline && styles.btnOutline,
          fullWidth && styles.btnFullWidth,
          noTopMargin && styles.btnNoTopMargin,
        ]}
        disabled={isLoading || disabled}
        accessibilityState={{ disabled: isLoading || !!disabled }}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={isOutline ? colors.PRIMARY : styles.actvIndicator.color}
          />
        ) : (
          <Text style={[styles.text, isOutline && styles.textOutline]}>{text}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.PRIMARY,
    height: 50,
    borderRadius: 100,
    marginTop: 15,
    paddingHorizontal: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.PRIMARY,
  },
  btnOutline: {
    backgroundColor: colors.BG_WHITE,
    // backgroundColor: colors.INPUT_BG,
    borderColor: colors.PRIMARY,
  },
  btnNoTopMargin: {
    marginTop: 0,
  },
  wrapFullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  btnFullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: 'roboto-bold',
    fontSize: 20,
    color: colors.BG_WHITE,
  },
  textOutline: {
    color: colors.PRIMARY,
  },
  actvIndicator: {
    color: colors.BG_WHITE,
  }
});