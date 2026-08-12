import { colors } from '@/constants/colors';
import { CIRCULAR_CLICK_HEIGHT, CIRCULAR_CLICK_WIDTH } from '@/constants/layout';
import { screenChromeStyles } from '@/constants/screenChrome';
import { useDrawerStore } from '@/store/drawer.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

type HomePinnedToolbarProps = {
  title: string;
  collapsedTitleStyle: object;
  toolbarStripStyle: object;
  height: number;
  unreadChatCount: number;
};

const HomePinnedToolbar = ({
  title,
  collapsedTitleStyle,
  toolbarStripStyle,
  height,
  unreadChatCount,
}: HomePinnedToolbarProps) => {
  const router = useRouter();
  const toggleDrawer = useDrawerStore((state) => state.toggle);

  return (
    <Animated.View
      style={[styles.pinnedToolbar, { height }, toolbarStripStyle]}
      pointerEvents="box-none"
    >
      <View style={screenChromeStyles.pinnedActionRow}>
        <View style={styles.headerSide}>
          <Pressable onPress={toggleDrawer} style={styles.toolbarIconBtn} accessibilityLabel="Open menu">
            <Ionicons name="menu" size={30} color={colors.PRIMARY} />
          </Pressable>
        </View>
        <View style={styles.toolbarTitleSlot} pointerEvents="none">
          <Animated.Text
            style={[screenChromeStyles.collapsedScrollTitle, collapsedTitleStyle]}
            numberOfLines={1}
          >
            {title}
          </Animated.Text>
        </View>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <View style={styles.chatIconWrap}>
            <Pressable
              style={[styles.toolbarIconBtn, styles.chatIconBtn]}
              onPress={() => router.push('/chats')}
              accessibilityLabel="Open chats"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={26} color={colors.PRIMARY} />
            </Pressable>
            {unreadChatCount > 0 ? (
              <View style={styles.chatBadge}>
                <Text style={styles.chatBadgeText}>
                  {unreadChatCount > 99 ? '99+' : unreadChatCount}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default HomePinnedToolbar;

const styles = StyleSheet.create({
  pinnedToolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    justifyContent: 'flex-end',
  },
  toolbarTitleSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    minWidth: 0,
  },
  headerSide: {
    width: 72,
    zIndex: 1,
    overflow: 'visible',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  toolbarIconBtn: {
    height: CIRCULAR_CLICK_HEIGHT,
    width: CIRCULAR_CLICK_WIDTH,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CIRCULAR_CLICK_WIDTH / 2,
  },
  chatIconWrap: {
    width: CIRCULAR_CLICK_WIDTH,
    height: CIRCULAR_CLICK_HEIGHT,
    position: 'relative',
    overflow: 'visible',
  },
  chatIconBtn: { borderWidth: 0 },
  chatBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.RED,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  chatBadgeText: {
    color: colors.BG_WHITE,
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 13,
  },
});
