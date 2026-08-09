import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { images } from '@/constants/images';
import { BORDER_RADIUS_PILL } from '@/constants/layout';
import {
  SEARCHBAR_LEADING_GAP,
  SEARCHBAR_LEADING_ICON_SIZE,
  SEARCHBAR_LEADING_LOGO_SIZE,
} from '@/constants/searchbar';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { forwardRef } from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  placeholder: string;
  inputValue: string;
  setValue: (value: string) => void;
  /** Leading adornment — logo on Home, search icon elsewhere. */
  leading?: 'search' | 'logo';
  /** Layout-only styles (e.g. margins). Box chrome lives in this component. */
  style?: StyleProp<ViewStyle>;
  returnKeyType?: TextInputProps['returnKeyType'];
  autoCorrect?: boolean;
}

const Searchbar = forwardRef<TextInput, Props>(function Searchbar(
  {
    placeholder,
    inputValue,
    setValue,
    leading = 'search',
    style,
    returnKeyType = 'search',
    autoCorrect = false,
  },
  ref,
) {
  return (
    <View style={[styles.container, style]}>
      {leading === 'logo' ? (
        <View style={styles.leadingLogoWrap}>
          <Image
            source={images.logo}
            style={styles.leadingLogo}
            resizeMode="contain"
            accessibilityLabel="QuickPeek"
          />
        </View>
      ) : (
        <Ionicons
          name="search-outline"
          size={SEARCHBAR_LEADING_ICON_SIZE}
          color={colors.PRIMARY}
          style={styles.leadingIcon}
        />
      )}
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor={colors.PLACEHOLDER}
        value={inputValue}
        onChangeText={setValue}
        style={styles.input}
        returnKeyType={returnKeyType}
        autoCorrect={autoCorrect}
      />
      {inputValue.length > 0 && (
        <Pressable
          onPress={() => setValue('')}
          style={styles.clearBtn}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color={colors.MEDIUM_GRAY} />
        </Pressable>
      )}
    </View>
  );
});

export default Searchbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS_PILL,
    paddingHorizontal: 16,
    backgroundColor: colors.INPUT_BG,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
  },
  leadingIcon: {
    marginRight: SEARCHBAR_LEADING_GAP,
  },
  leadingLogoWrap: {
    width: SEARCHBAR_LEADING_LOGO_SIZE,
    height: SEARCHBAR_LEADING_LOGO_SIZE,
    marginRight: SEARCHBAR_LEADING_GAP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingLogo: {
    width: SEARCHBAR_LEADING_LOGO_SIZE,
    height: SEARCHBAR_LEADING_LOGO_SIZE,
  },
  input: {
    flex: 1,
    fontFamily: 'roboto',
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.TEXT_DARK,
    paddingVertical: 12,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 4,
  },
});
