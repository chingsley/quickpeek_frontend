import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

type HomeFloatingAskButtonProps = {
  fabContainerStyle: object;
  fabTextStyle: object;
};

const HomeFloatingAskButton = ({ fabContainerStyle, fabTextStyle }: HomeFloatingAskButtonProps) => {
  const router = useRouter();

  return (
    <Animated.View style={[styles.floatingAskBtn, fabContainerStyle]}>
      <Pressable
        style={styles.floatingAskBtnInner}
        onPress={() => router.push('/ask')}
        accessibilityLabel="Ask a Question"
        accessibilityRole="button"
      >
        <Ionicons name="add-circle-outline" size={22} color={colors.BG_WHITE} />
        <Animated.Text style={[styles.floatingAskBtnText, fabTextStyle]} numberOfLines={1}>
          Ask a Question
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
};

export default HomeFloatingAskButton;

const styles = StyleSheet.create({
  floatingAskBtn: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY,
    shadowColor: colors.BG_BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  floatingAskBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  floatingAskBtnText: {
    fontFamily: 'roboto-bold',
    fontSize: fonts.FONT_SIZE_SMALL,
    color: colors.BG_WHITE,
    overflow: 'hidden',
  },
});
